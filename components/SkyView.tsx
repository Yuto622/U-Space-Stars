import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { BRIGHT_STARS } from '../constants';
import { CelestialObject } from '../types';
import { getSkyObjects } from '../services/astronomyService';
import { getStarInfo } from '../services/geminiService';
import { Camera, Compass, Info, X, Sparkles, Loader2 } from 'lucide-react';

interface SkyViewProps {
  userLocation: { lat: number; lon: number } | null;
}

const SkyView: React.FC<SkyViewProps> = ({ userLocation }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [viewAngle, setViewAngle] = useState({ az: 180, alt: 45 }); // Looking South, 45deg up
  const [celestialObjects, setCelestialObjects] = useState<CelestialObject[]>([]);
  const [selectedStar, setSelectedStar] = useState<CelestialObject | null>(null);
  const [aiInfo, setAiInfo] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Drag handling state
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Update star positions live
  useEffect(() => {
    if (!userLocation) return;
    
    const updateStars = () => {
      const now = new Date();
      const objects = getSkyObjects(BRIGHT_STARS, userLocation.lat, userLocation.lon, now);
      setCelestialObjects(objects);
    };

    updateStars();
    const interval = setInterval(updateStars, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [userLocation]);

  // Handle Camera for AR
  useEffect(() => {
    if (isARMode) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Camera access denied", err);
          setIsARMode(false); // Fallback
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isARMode]);

  // Handle Device Orientation (Experimental)
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isARMode) return;
    // Simple mapping: alpha (compass) -> Azimuth, beta (tilt) -> Altitude
    // Note: This needs complex calibration in a real production app.
    // Assuming portrait mode for simplicity.
    const alpha = event.alpha || 0; 
    const beta = event.beta || 0; // -180 to 180
    
    // Invert alpha for correct compass rotation visually
    let newAz = 360 - alpha; 
    // Map beta to altitude (horizon is 90 in device coords usually)
    let newAlt = beta < 0 ? 0 : beta; 
    if (newAlt > 90) newAlt = 90;

    setViewAngle({ az: newAz, alt: newAlt });
  }, [isARMode]);

  useEffect(() => {
    if (isARMode && window.DeviceOrientationEvent) {
       // Request permission for iOS 13+
       // (This usually needs a user button click trigger, managed by permissionGranted state if needed)
       window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isARMode, handleOrientation]);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Projection: Stereographic for wide view
    // Rotate the projection based on viewAngle
    // d3.geoProjection rotates [yaw, pitch, roll] -> [-azimuth, -altitude, 0]
    const projection = d3.geoStereographic()
      .scale(800) // Zoom level
      .translate([width / 2, height / 2])
      .clipAngle(90) // Show hemisphere
      .rotate([-viewAngle.az, -viewAngle.alt, 0]); 

    // Draw Horizon Grid (Optional visual aid)
    const graticule = d3.geoGraticule().step([15, 15]);
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", d3.geoPath(projection))
      .style("fill", "none")
      .style("stroke", "rgba(255,255,255,0.05)")
      .style("stroke-width", "1px");

    // Draw Stars
    const starGroup = svg.append("g");
    
    celestialObjects.forEach(star => {
      if (!star.visible) return;

      // Convert Alt/Az to spherical coordinates for D3
      // D3 expects Longitude (Azimuth-ish) and Latitude (Altitude)
      // We need to map star's Az/Alt to the projection space.
      // Actually, since we rotated the projection to match viewAngle,
      // we need to project the star's calculated Az/Alt.
      
      // Note: Azimuth is 0=North, 90=East. D3 geo uses standard math angles.
      // We pass the star's Az/Alt directly as [lon, lat] equivalent.
      const projected = projection([star.azimuth!, star.altitude!]);
      
      if (projected) {
        const [x, y] = projected;

        // Star Glow
        starGroup.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", Math.max(2, 6 - star.mag * 1.5)) // Size based on magnitude
          .attr("fill", star.color)
          .attr("opacity", 0.8)
          .style("filter", "blur(1px)");

        // Click Area
        starGroup.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 20) // Hit target
          .attr("fill", "transparent")
          .attr("cursor", "pointer")
          .on("click", () => handleStarClick(star));

        // Label for bright stars
        if (star.mag < 1.5) {
            starGroup.append("text")
            .attr("x", x)
            .attr("y", y + 15)
            .text(star.name)
            .attr("text-anchor", "middle")
            .attr("fill", "rgba(255,255,255,0.7)")
            .attr("font-size", "10px")
            .style("pointer-events", "none");
        }
      }
    });

    // Compass Indicator (Bottom center)
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 100)
      .text(`${Math.round(viewAngle.az)}° ${getCardinalDirection(viewAngle.az)}`)
      .attr("text-anchor", "middle")
      .attr("fill", "cyan")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

  }, [viewAngle, celestialObjects, window.innerWidth, window.innerHeight]);

  const getCardinalDirection = (az: number) => {
    const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
    return directions[Math.round(az / 45) % 8];
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || isARMode) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const dx = clientX - lastMousePos.current.x;
    const dy = clientY - lastMousePos.current.y;

    setViewAngle(prev => ({
      az: (prev.az - dx * 0.2 + 360) % 360,
      alt: Math.max(0, Math.min(90, prev.alt + dy * 0.2))
    }));

    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const handleStarClick = async (star: CelestialObject) => {
    setSelectedStar(star);
    setAiInfo(null);
    setIsLoadingAi(true);
    const info = await getStarInfo(star.name, star.constellation);
    setAiInfo(info);
    setIsLoadingAi(false);
  };

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden select-none"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Background: Video (AR) or Gradient (Virtual) */}
      {isARMode ? (
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay 
          playsInline 
          muted 
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#090915] to-black" />
      )}

      {/* Star Layer */}
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full z-10"
        style={{ pointerEvents: 'all' }} // Allow drag on svg
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        <button 
          onClick={() => setIsARMode(!isARMode)}
          className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${isARMode ? 'bg-cyan-500 text-white' : 'bg-black/40 text-cyan-400'}`}
        >
          <Camera size={24} />
        </button>
      </div>

      <div className="absolute top-4 left-4 z-20">
         <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-xs text-white/70">
            {isARMode ? "ARモード: 端末を動かしてください" : "スワイプで視点移動"}
         </div>
      </div>

      {/* Star Info Modal */}
      {selectedStar && (
        <div className="absolute bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="glass-panel rounded-2xl p-5 shadow-2xl border-t border-cyan-500/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white neon-text">{selectedStar.name}</h2>
                <p className="text-cyan-300 text-sm">{selectedStar.constellation}座 / {selectedStar.mag}等星</p>
              </div>
              <button onClick={() => setSelectedStar(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3 min-h-[80px]">
              {isLoadingAi ? (
                <div className="flex items-center gap-2 text-cyan-200">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-sm">Geminiが星の物語を検索中...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-200 leading-relaxed">
                  <div className="flex items-start gap-2 mb-1">
                     <Sparkles size={16} className="text-yellow-400 mt-1 shrink-0" />
                     <p>{aiInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkyView;