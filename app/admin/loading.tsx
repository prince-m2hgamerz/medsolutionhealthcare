export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-aloe-10/30 border-t-aloe-10 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-body-md text-shade-40">Loading...</p>
      </div>
    </div>
  );
}
