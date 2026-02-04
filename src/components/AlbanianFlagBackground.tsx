export default function AlbanianFlagBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Red Background */}
      <div className="absolute inset-0 bg-primary-red" />
      
      {/* Black Double-Headed Eagle SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="translate(150, 100) scale(0.4)">
          <path
            fill="#000000"
            d="M250,50 
               C230,50 210,60 200,80
               L180,60 L160,80 L180,100
               C160,120 150,150 150,180
               L100,180 L100,200 L150,200
               L150,250 L100,300 L150,350
               L150,400 L180,450 L250,500
               L320,450 L350,400 L350,350
               L400,300 L350,250 L350,200
               L400,200 L400,180 L350,180
               C350,150 340,120 320,100
               L340,80 L320,60 L300,80
               C290,60 270,50 250,50z
               M220,150 L250,180 L280,150
               L280,220 L320,220 L280,260
               L280,330 L250,360 L220,330
               L220,260 L180,220 L220,220z"
          />
        </g>
      </svg>
      
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-red/50 via-transparent to-dark-blue/30" />
    </div>
  );
}
