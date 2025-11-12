// ...existing code...
import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value.trim();
    if (!email) return;
    // TODO: integrate with newsletter API
    alert(`Subscribed: ${email}`);
    e.target.reset();
  };

  return (
    <footer className="bg-dark text-light mt-5" aria-label="Site footer">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="mb-3">Daksh Mobile Accessories</h5>
            <p className="small">
              Premium mobile accessories — chargers, cables, cases and more. High quality products with
              fast shipping and reliable customer support.
            </p>
            <p className="small mb-0">
              © {year} Daksh Mobile Accessories
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/shop" className="text-light text-decoration-none">Shop</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li><a href="/returns" className="text-light text-decoration-none">Returns &amp; Refunds</a></li>
              <li><a href="/shipping" className="text-light text-decoration-none">Shipping Info</a></li>
              <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="/terms" className="text-light text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="mb-3">Contact</h6>
            <address className="small">
              Phone: <a href="tel:+911234567890" className="text-light text-decoration-none">+91 12345 67890</a><br />
              Email: <a href="mailto:info@dakshmobile.com" className="text-light text-decoration-none">info@dakshmobile.com</a><br />
              Address: 123, Market Road, Your City
            </address>

            <form className="mt-3" onSubmit={handleSubscribe} aria-label="Subscribe to newsletter">
              <label htmlFor="footer-email" className="visually-hidden">Email address</label>
              <div className="d-flex">
                <input id="footer-email" name="email" type="email" className="form-control form-control-sm me-2" placeholder="Email for offers" aria-label="Email" />
                <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
              </div>
            </form>

            <div className="mt-3">
              <span className="me-2 small">Follow us:</span>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-light me-2">
                {/* simple fb svg */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.38v1.65h2.45l-.39 2.9h-2.06v7A10 10 0 0022 12z" /></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-light me-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm6.8-3.2a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z" /></svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-light">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 004.98 8.5H5a2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.6v1.7h.1c.5-.9 1.8-1.7 3.7-1.7 4 0 4.7 2.6 4.7 6v6H20v-5.3c0-2.3-.04-5.3-3.2-5.3-3.2 0-3.7 2.5-3.7 5.1V21H9z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-center text-muted small py-2" style={{opacity: 0.9}}>
        <div className="container">
          <span>Made with care • Secure payments • Free returns within 7 days</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
// ...existing code...