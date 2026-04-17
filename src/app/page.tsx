import Link from "next/link";
import {
  Leaf,
  Building2,
  Users,
  Truck,
  Sprout,
  Heart,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Recycle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AnnaDaan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-8">
              <Leaf className="w-4 h-4" />
              Reducing Food Waste, One Meal at a Time
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Turn Food Waste Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {" "}
                Impact
              </span>
            </h1>
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Connect food donors, NGOs, waste collectors, farmers, and
              beneficiaries in one intelligent ecosystem. Earn carbon credits
              while feeding the hungry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                Start Donating
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border border-gray-700 text-white rounded-xl font-medium text-lg hover:bg-gray-800 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: "50K+", label: "Meals Delivered" },
              { value: "2.5T", label: "CO₂ Saved" },
              { value: "500+", label: "Active Partners" },
              { value: "₹15L+", label: "Carbon Credits Traded" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-900/50 rounded-2xl border border-gray-800"
              >
                <p className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              A seamless ecosystem connecting all stakeholders in the food
              redistribution chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Donors Post Food",
                description:
                  "Hotels, restaurants, and events list surplus food with shelf-life tracking and earn carbon credits",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Users,
                title: "NGOs & Collectors Match",
                description:
                  "AI matches food listings to NGO requirements. Collectors pick up and distribute to those in need",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Sprout,
                title: "Waste Becomes Value",
                description:
                  "Organic waste goes to biogas plants or farmers for composting, generating more carbon credits",
                color: "from-green-500 to-green-600",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-8 bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">For Everyone</h2>
            <p className="text-gray-400 mt-4">
              Join as any stakeholder and be part of the solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Food Donors",
                description:
                  "Hotels, restaurants, events - donate surplus food, save on disposal costs, earn carbon credits",
                features: [
                  "Free decomposition service",
                  "Tax certificates",
                  "Carbon credits",
                ],
                color: "blue",
              },
              {
                icon: Users,
                title: "NGOs & Charities",
                description:
                  "Post requirements, get AI-matched listings, coordinate with collectors",
                features: [
                  "AI-powered matching",
                  "NGO network",
                  "Impact analytics",
                ],
                color: "purple",
              },
              {
                icon: Truck,
                title: "Waste Collectors",
                description:
                  "Pick up food, distribute to needy, deliver waste to biogas plants",
                features: [
                  "Route optimization",
                  "Impact scoring",
                  "Earn credits",
                ],
                color: "orange",
              },
              {
                icon: Sprout,
                title: "Farmers",
                description:
                  "Buy organic waste at low prices, save on fertilizers, track ROI",
                features: [
                  "Waste marketplace",
                  "ROI calculator",
                  "Compost tracking",
                ],
                color: "green",
              },
              {
                icon: Heart,
                title: "Beneficiaries",
                description:
                  "Find available food nearby, connect with NGOs, get assistance",
                features: ["Food search", "NGO connect", "Mobile-first"],
                color: "red",
              },
              {
                icon: TrendingUp,
                title: "Corporates",
                description:
                  "Buy carbon credits to offset emissions, CSR compliance",
                features: [
                  "Carbon marketplace",
                  "Verified credits",
                  "Impact reports",
                ],
                color: "emerald",
              },
            ].map((role, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${role.color}-500/10 flex items-center justify-center mb-4`}
                >
                  <role.icon className={`w-6 h-6 text-${role.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carbon Credits */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Earn Carbon Credits
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Every kilogram of food diverted from landfills generates
                verifiable carbon credits. Sell them to corporates looking to
                offset their emissions.
              </p>
              <ul className="space-y-4">
                {[
                  "2.5 kg CO₂ saved per kg of food diverted",
                  "Biogas processing adds 30% more credits",
                  "Verified and tradeable on our marketplace",
                  "Current market price: ₹150/credit",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
              >
                Start Earning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Recycle className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400">Total Credits Generated</p>
                  <p className="text-3xl font-bold text-white">12,450</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Food Diversion</span>
                  <span className="text-green-400 font-medium">8,200 credits</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Biogas Processing</span>
                  <span className="text-green-400 font-medium">3,150 credits</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Composting</span>
                  <span className="text-green-400 font-medium">1,100 credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of donors, NGOs, and collectors already using
            AnnaDaan to reduce food waste and feed the hungry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-lg hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border border-gray-700 text-white rounded-xl font-medium text-lg hover:bg-gray-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AnnaDaan</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 AnnaDaan. All rights reserved. Reducing food waste, one
              meal at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
