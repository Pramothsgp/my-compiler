
const FallBack = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#ece9ff] to-[#cfd9df] text-[#2d2d2d] font-sans">
      <h2 className="text-5xl font-bold mb-4 text-[#5a189a] tracking-wider">
        404 - Page Not Found
      </h2>
      <p className="text-lg text-[#333] bg-white px-8 py-4 rounded-lg shadow-lg">
        The page you are looking for does not exist.
      </p>
    </div>
  )
}

export default FallBack