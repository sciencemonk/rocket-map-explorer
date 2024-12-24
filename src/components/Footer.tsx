const Footer = () => {
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Space Globe. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/space-globe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.rocketlaunch.live"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Data: RocketLaunch.live
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;