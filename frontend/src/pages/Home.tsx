import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">
          Welcome to Expense Tracker
        </h1>
        <p className="text-xl animate-fade-in delay-200">
          Track your expenses smartly and easily.
        </p>
      </div>
    </div>
  );
};
export default Home;