import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const navigation = {
  services: [
    { name: "Transaction Advisory", href: "https://ascendadvisory.vercel.app/#services" },
    { name: "Business Development", href: "https://ascendadvisory.vercel.app/#services" },
    { name: "Finance Enhancement", href: "https://ascendadvisory.vercel.app/#services" },
    { name: "Outsourced Finance", href: "https://ascendadvisory.vercel.app/#services" },
  ],
  company: [
    { name: "Home", href: "https://ascendadvisory.vercel.app/" },
    { name: "Blog", href: "/blog" },
    { name: "Insights", href: "/insights" },
    { name: "Careers", href: "/careers" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#21435f] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="https://ascendadvisory.vercel.app/" className="text-xl font-semibold text-white">
              Ascend <span className="text-primary">Advisory</span>
            </Link>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Expert accounting and advisory services designed to help your business grow with confidence and clarity.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:Bemnet.abebe.et@gmail.com"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Bemnet.abebe.et@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+251943071109"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  +(251) 943 071109
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/80">
                  Addis Ababa, Ethiopia<br />
                  Infront of Bole Medhanealem<br />
                  Beza Building, 4th Floor - No. 403
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} Ascend Accounting and Advisory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
