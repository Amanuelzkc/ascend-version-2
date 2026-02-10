import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import ascend from "@/asset/ascend.png";

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
    <footer className="bg-[#334155] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="https://ascendadvisory.vercel.app/" className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 lg:h-16 lg:w-16">
                <Image
                  src={ascend}
                  alt="Ascend Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-xl font-bold tracking-tight text-white">
                  Ascend
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Finance and Advisory
                </span>
              </div>
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
                <Mail className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:Bemnet.abebe.et@gmail.com"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Bemnet.abebe.et@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+251943071109"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  +(251) 943 071109
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white dark:text-white flex-shrink-0 mt-0.5" />
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
            &copy; {new Date().getFullYear()} Ascend Finance and Advisory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
