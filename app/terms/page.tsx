import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Terms of Use – The Andreas Hotel & Spa",
  description:
    "Read the terms and conditions governing the use of The Andreas Hotel & Spa website and services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero */}
      <section
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          backgroundImage: "url(/hotel-photos/exterior.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-4">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">
            Terms of Use
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="space-y-10 font-body text-[var(--hotel-charcoal)] leading-relaxed">
            <p>
              The following terms and conditions govern all use of the AndreasHotel.com website and all
              content, services and products available at or through the website (taken together, the
              Website). The Website is owned and operated by Andreas Hotel & Spa ("Andreas Hotel & Spa").
              The Website is offered subject to your acceptance without modification of all of the terms
              and conditions contained herein and all other operating rules, policies (including, without
              limitation, Andreas Hotel's Privacy Policy) and procedures that may be published from time
              to time on this Site by Andreas Hotel & Spa (collectively, the "Agreement").
            </p>
            <p>
              Please read this Agreement carefully before accessing or using the Website. By accessing or
              using any part of the website, you agree to become bound by the terms and conditions of this
              agreement. If you do not agree to all the terms and conditions of this agreement, then you
              may not access the Website or use any services. If these terms and conditions are considered
              an offer by Andreas Hotel & Spa, acceptance is expressly limited to these terms. The Website
              is available only to individuals who are at least 13 years old.
            </p>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Your Account
              </h2>
              <p>
                If you create an account on the Website, you are responsible for maintaining the security
                of your account, and you are fully responsible for all activities that occur under the
                account and any other actions taken in connection with it. You must immediately notify
                Andreas Hotel & Spa of any unauthorized uses of your account or any other breaches of
                security. Andreas Hotel & Spa will not be liable for any acts or omissions by you,
                including any damages of any kind incurred as a result of such acts or omissions.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Responsibility of Contributors
              </h2>
              <p>
                If you post material to the Website, post links on the Website, or otherwise make material
                available by means of the Website (any such material, "Content"), you are entirely
                responsible for the content of, and any harm resulting from, that Content. By making
                Content available, you represent and warrant that the Content does not infringe the
                proprietary rights of any third party and does not contain viruses, malware, or other
                harmful content. By submitting Content to Andreas Hotel & Spa for inclusion on the
                Website, you grant Andreas Hotel & Spa a world-wide, royalty-free, and non-exclusive
                license to reproduce, modify, adapt and publish the Content solely for the purpose of
                displaying, distributing and promoting the Website.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Intellectual Property
              </h2>
              <p>
                This Agreement does not transfer from Andreas Hotel & Spa to you any Andreas Hotel & Spa
                or third party intellectual property, and all right, title and interest in and to such
                property will remain solely with Andreas Hotel & Spa. Andreas Hotel & Spa,
                AndreasHotel.com, the AndreasHotel.com logo, and all other trademarks, service marks,
                graphics and logos used in connection with AndreasHotel.com are trademarks or registered
                trademarks of Andreas Hotel & Spa or Andreas Hotel's licensors. Your use of the Website
                grants you no right or license to reproduce or otherwise use any Andreas Hotel & Spa or
                third-party trademarks.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Copyright Infringement (DMCA)
              </h2>
              <p>
                As Andreas Hotel & Spa asks others to respect its intellectual property rights, it respects
                the intellectual property rights of others. If you believe that material located on or
                linked to by AndreasHotel.com violates your copyright, you are encouraged to notify Andreas
                Hotel & Spa. Andreas Hotel & Spa will respond to all such notices, including as required or
                appropriate by removing the infringing material or disabling all links to the infringing
                material.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Changes
              </h2>
              <p>
                Andreas Hotel & Spa reserves the right, at its sole discretion, to modify or replace any
                part of this Agreement. It is your responsibility to check this Agreement periodically for
                changes. Your continued use of or access to the Website following the posting of any
                changes to this Agreement constitutes acceptance of those changes.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Disclaimer of Warranties
              </h2>
              <p>
                The Website is provided "as is". Andreas Hotel & Spa and its suppliers and licensors
                hereby disclaim all warranties of any kind, express or implied, including, without
                limitation, the warranties of merchantability, fitness for a particular purpose and
                non-infringement. Neither Andreas Hotel & Spa nor its suppliers and licensors makes any
                warranty that the Website will be error free or that access thereto will be continuous or
                uninterrupted.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Limitation of Liability
              </h2>
              <p>
                In no event will Andreas Hotel & Spa, or its suppliers or licensors, be liable with
                respect to any subject matter of this agreement under any contract, negligence, strict
                liability or other legal or equitable theory for: (i) any special, incidental or
                consequential damages; (ii) the cost of procurement for substitute products or services;
                (iii) for interruption of use or loss or corruption of data; or (iv) for any amounts that
                exceed the fees paid by you to Andreas Hotel & Spa under this agreement during the twelve
                (12) month period prior to the cause of action. Andreas Hotel & Spa shall have no liability
                for any failure or delay due to matters beyond their reasonable control.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Andreas Hotel & Spa, its contractors, and its
                licensors, and their respective directors, officers, employees and agents from and against
                any and all claims and expenses, including attorneys' fees, arising out of your use of the
                Website, including but not limited to your violation of this Agreement.
              </p>
            </section>

            <section>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-4">
                Governing Law
              </h2>
              <p>
                This Agreement, any access to or use of the Website will be governed by the laws of the
                State of California, U.S.A., excluding its conflict of law provisions, and the proper venue
                for any disputes arising out of or relating to any of the same will be the state and
                federal courts located in Los Angeles County, California.
              </p>
            </section>

            <div className="border-t border-[var(--hotel-sand)] pt-12 mt-12">
              <p className="text-sm text-[var(--hotel-charcoal)]/70">
                If you have questions about these Terms of Use, please contact us at{" "}
                <a href="mailto:stay@andreashotel.com" className="text-[var(--hotel-terracotta)] hover:underline">
                  stay@andreashotel.com
                </a>{" "}
                or call{" "}
                <a href="tel:8883275701" className="text-[var(--hotel-terracotta)] hover:underline">
                  888-327-5701
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
