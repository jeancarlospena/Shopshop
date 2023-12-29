const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className=" py-5 text-bg-secondary mt-5 bg-dark">
      <div className="container">
        <div className="text-center">
          <p>Shopshop &copy; {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
