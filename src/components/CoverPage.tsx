export default function CoverPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <img
        src="/journal-cover.jpg"
        alt="Journal Cover"
        className="object-contain mb-6"
        style={{
          maxHeight: '80vh',
          maxWidth: '90vw',
        }}
      />
      <button
        onClick={onEnter}
        className="px-6 py-3 bg-white text-black font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
      >
        Enter Journal
      </button>
    </div>
  );
}
