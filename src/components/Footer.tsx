const Footer = () => {
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AstroAthens. All rights reserved.
        </div>
        <div>
          <a
            href="https://www.patreon.com/astroathens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
          >
            <span>❤️</span>
            Support Space Globe
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;