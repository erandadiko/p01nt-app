'use client';

export default function AlbanianFlagBackground() {
  return (
    <div
      className="absolute inset-0 bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Albania.svg')",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
