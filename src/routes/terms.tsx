import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  P,
  OL,
  UL,
  LI,
  Sub,
} from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Sokonyumbani" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of the SoQoni App and services, including customer, seller, service provider, and rider terms.",
      },
      { property: "og:title", content: "Terms & Conditions — Sokonyumbani" },
      {
        property: "og:description",
        content:
          "The terms and conditions governing your use of the SoQoni App and services.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="SOQONI APP TERMS AND CONDITIONS"
      lastUpdated="18 May 2026"
      effectiveDate="18 June 2026"
      intro={
        <P>
          These Terms and Conditions govern your access to and use of the SoQoni
          mobile application and all related services. By downloading,
          accessing, or using the Services, you agree to be bound by these
          Terms, the SoQoni Privacy Policy, and the Refund Policy.
        </P>
      }
      sections={[
        {
          heading: "Preamble — Introduction and Acceptance",
          body: (
            <>
              <P>
                These Terms and Conditions (“Terms”) constitute a legally
                binding contractual agreement between you, the user (“you,”
                “your”), and Sokoni Applications Ltd, a company duly incorporated
                under the laws of the Republic of Kenya with its registered
                office at Kitengela, Red Heron Mall, Room F18 (hereinafter
                referred to as “Soal,” “Company,” “we,” “us,” “our”), governing
                your access to and utilization of the SoQoni mobile application,
                associated websites, and all related services, content, and
                functionalities (collectively, the “Services”).
              </P>
              <P>
                By downloading, installing, accessing, or using the Services in
                any manner, you explicitly acknowledge that you have read,
                understood, and irrevocably agree to be bound by all the
                provisions, covenants, and stipulations contained within these
                Terms, as well as our incorporated Privacy Policy and Refund
                Policy. If you do not unconditionally accept and agree to all
                these Terms, you are expressly prohibited from using the Services
                and must discontinue use immediately.
              </P>
            </>
          ),
        },
        {
          heading: "Modification of Terms",
          body: (
            <P>
              Soal reserves the sole, absolute, and unfettered right, at its
              discretion, to amend, modify, alter, or supplement these Terms at
              any time and for any reason. Such modifications shall become
              effective immediately upon their posting within the Application or
              on our associated website. Your continued access or use of the
              Services following the posting of any revised Terms constitutes
              your definitive and unequivocal acceptance of those changes. It
              is your sole responsibility to periodically review these Terms to
              stay informed of any updates.
            </P>
          ),
        },
        {
          heading: "Relationship with Other Policies and Agreements",
          body: (
            <P>
              These Terms shall be read together with the SoQoni App Privacy
              Policy, Refund Policy, and any specific agreements entered into
              between Soal and Users, including the Seller Partnership
              Agreement. In the event of any conflict between these Terms and a
              specific agreement executed with a User, the specific agreement
              shall prevail to the extent of that inconsistency.
            </P>
          ),
        },
        {
          heading: "Part A: General Terms for All Users — Definitions",
          body: (
            <>
              <P>
                For the purposes of these Terms, the following capitalized terms
                shall have the meanings ascribed to them below:
              </P>
              <UL>
                <LI>
                  <strong>“App” or “Application”</strong> shall refer to the
                  SoQoni mobile application, including all its updates, versions,
                  and any related web-based platforms operated by Soal.
                </LI>
                <LI>
                  <strong>“Customer”</strong> shall mean any natural or legal
                  person who accesses the Services for the purpose of procuring
                  goods or services from Sellers or Service Providers via the
                  App.
                </LI>
                <LI>
                  <strong>“Seller”</strong> shall denote any registered
                  business, merchant, or individual that has been granted
                  permission by Soal to list, advertise, offer, and sell goods
                  to Customers through the App, and who has executed a Seller
                  Partnership Agreement with Soal.
                </LI>
                <LI>
                  <strong>“Service Provider”</strong> shall mean any registered
                  business or individual offering services through the App,
                  including but not limited to professional services, repair
                  services, or other non-goods offerings.
                </LI>
                <LI>
                  <strong>“Rider”</strong> shall refer to an independent,
                  third-party delivery contractor who is verified by Soal to
                  provide logistics and delivery services for transactions
                  conducted on the App.
                </LI>
                <LI>
                  <strong>“Active Session”</strong> describes the operational
                  status wherein a Seller, Service Provider, or Rider has the
                  Application open, is logged into their account, or is actively
                  indicating availability to receive order requests or delivery
                  assignments from the system.
                </LI>
                <LI>
                  <strong>“Proximity Matching Algorithm”</strong> signifies
                  Soal’s proprietary automated system designed to
                  algorithmically assign an incoming Customer order to the
                  geographically nearest Seller or Service Provider maintaining
                  an Active Session, and subsequently to assign the fulfillment
                  of that order to the geographically nearest Rider to the
                  Seller or Service Provider who is also in an Active Session.
                </LI>
                <LI>
                  <strong>“Content”</strong> encompasses all text, graphics,
                  user interfaces, visual interfaces, images, trademarks,
                  logos, sounds, music, artwork, computer code, and all other
                  intellectual property and materials made available on or
                  through the App.
                </LI>
                <LI>
                  <strong>“Market”</strong> means a designated geographical
                  segment within a town, created to ensure speed and
                  convenience of delivery, from which Customers may purchase
                  goods or services.
                </LI>
                <LI>
                  <strong>“Seller Partnership Agreement”</strong> means the
                  separate agreement entered into between Soal and a Seller or
                  Service Provider governing their specific relationship,
                  including terms related to payments, fees, technology
                  obligations, and marketing support.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Eligibility and Account Registration",
          body: (
            <UL>
              <LI>
                By affirming your acceptance to these Terms, you represent and
                warrant that you are at least eighteen (18) years of age and
                possess the full legal capacity, right, and authority to enter
                into this binding agreement. The Services are not intended for
                and may not be used by individuals under the age of 18.
              </LI>
              <LI>
                You further covenant and agree to provide accurate, current,
                complete, and non-misleading information during the registration
                process and to promptly update such information to maintain its
                accuracy and completeness at all times.
              </LI>
              <LI>
                You are solely and entirely responsible for maintaining the
                strict confidentiality of your account credentials, including
                your password, and for all activities and transactions that
                occur under your account. You must immediately notify Soal of
                any unauthorized use of your account or any other breach of
                security.
              </LI>
              <LI>
                Soal reserves the right, in its sole and absolute discretion, to
                refuse service, suspend, or terminate your account, and/or
                cancel orders, at any time and without liability, if it suspects
                or discovers that you have provided false, inaccurate, or
                misleading information, or have engaged in fraudulent,
                deceptive, or illegal activities through the use of the
                Services.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Intellectual Property Rights",
          body: (
            <UL>
              <LI>
                The Services, including but not limited to their entire
                contents, features, functionality, source code, databases,
                software, design, audio, video, text, photographs, graphics,
                and the trademarks, service marks, and logos contained therein
                (“Soal IP”), are owned by Soal, its licensors, or other providers
                of such material and are protected by the laws of the Republic
                of Kenya and international copyright, trademark, patent, trade
                secret, and other intellectual property or proprietary rights
                laws.
              </LI>
              <LI>
                You are granted a limited, non-exclusive, non-transferable,
                non-sublicensable, and revocable license to access and use the
                Services for your personal, non-commercial use, strictly in
                accordance with these Terms. No right, title, or interest in or
                to the Soal IP is transferred to you.
              </LI>
              <LI>
                You expressly agree not to engage in the reproduction,
                distribution, modification, creation of derivative works of,
                public display, public performance, republishing, downloading,
                storing, or transmitting any of the Soal IP, except as expressly
                permitted by these Terms.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Prohibited Conduct",
          body: (
            <>
              <P>You hereby expressly covenant and agree not to engage in any of the following prohibited activities:</P>
              <UL>
                <LI>
                  The use of any software, device, script, or routine, including
                  but not limited to fake GPS applications, to interfere or
                  attempt to interfere with the normal operations of the App,
                  including the spoofing or falsification of your geographical
                  location.
                </LI>
                <LI>
                  Any form of collusion, coordination, or fraudulent arrangement
                  between Users, including between Customers and Sellers,
                  Service Providers, or Riders, designed to manipulate the
                  platform, its pricing, its rating system, or to create fake
                  orders.
                </LI>
                <LI>
                  The artificial, systematic, or bad-faith rejection of orders
                  or assignments without a legitimate and justifiable cause.
                </LI>
                <LI>
                  The harassment, abuse, intimidation, defamation, or harm of
                  any other User, Rider, Seller, Service Provider, employee of
                  Soal, or any other person.
                </LI>
                <LI>
                  The use of the Services for any unlawful, fraudulent, or
                  malicious purpose, or in any way that violates any applicable
                  local, national, or international law or regulation.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Limitation of Liability and Indemnification",
          body: (
            <UL>
              <LI>
                To the maximum extent permitted by the laws of the Republic of
                Kenya, in no event shall Soal, its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation loss of profits, data,
                use, goodwill, or other intangible losses, resulting from (i)
                your access to or use of or inability to access or use the
                Services; (ii) any conduct or content of any third party
                (including other Users) on the Services; (iii) any content
                obtained from the Services; and (iv) unauthorized access, use, or
                alteration of your transmissions or content, whether based on
                warranty, contract, tort (including negligence), or any other
                legal theory, whether or not we have been informed of the
                possibility of such damage.
              </LI>
              <LI>
                Soal shall not be held liable for any damages, losses, or
                injuries arising from: (i) the actions, omissions, negligence,
                or misconduct of any User, including but not limited to a
                Seller’s failure to provide goods of merchantable quality, a
                Service Provider’s failure to deliver professional services, or
                a Rider’s failure to exercise due care in delivery; (ii) any
                delays in delivery or service interruptions caused by factors
                beyond our reasonable control, including traffic congestion,
                adverse weather conditions, acts of God, public utility
                failures, or force majeure events; (iii) any personal injury or
                property damage arising from the use of the services, except
                where proven to be a direct result of the gross negligence of
                Soal; (iv) payments sent to a wrong M-Pesa number provided by a
                User.
              </LI>
              <LI>
                You agree to defend, indemnify, and hold harmless Soal and its
                licensors and affiliates from and against any and all claims,
                damages, obligations, losses, liabilities, costs, debt, and
                expenses (including but not limited to attorney’s fees) arising
                from: (i) your use of and access to the Services; (ii) your
                violation of any term of these Terms; (iii) your violation of
                any third-party right, including any copyright, property, or
                privacy right; or (iv) any claim that your content caused damage
                to a third party.
              </LI>
            </UL>
          ),
        },
        {
          heading:
            "Part B: Additional Terms for Customers — Order Placement and Market Segmentation",
          body: (
            <UL>
              <LI>
                The Customer acknowledges and agrees that the Services are
                structured upon a hyper-localized model wherein each operational
                town is segmented into distinct and semi-autonomous market
                areas. For the inaugural town of Kitengela, these markets are
                defined as CBD, EPZ, Milimani, Yukos, Acacia, and Korompoi.
              </LI>
              <LI>
                The Customer may purchase goods or services from the same market
                or from different markets in a single order. Delivery shall be
                processed as one order only, even if the order involves multiple
                stores, service providers, and multiple markets.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Pricing, Fees, and Payment Terms",
          body: (
            <>
              <P>
                The Customer acknowledges that all prices for goods and services
                displayed on the App are set solely by the Sellers or Service
                Providers and are inclusive of all applicable taxes, which
                remain the sole responsibility of the Seller or Service Provider
                to remit to the relevant authorities. The Customer agrees that
                the price of an identical product or service may vary between
                different market areas and between different Sellers or Service
                Providers within the same market area.
              </P>
              <P>By placing an Order, the Customer irrevocably agrees to pay the following amounts in full:</P>
              <OL>
                <LI>
                  the total listed purchase price for all goods or services
                  procured, calculated before the application of any promotional
                  deductions;
                </LI>
                <LI>
                  a Service Charge calculated in Kshs. as follows, which charge
                  is applied before any promotional deductions are made:
                </LI>
              </OL>
              <div className="overflow-x-auto my-3">
                <table className="w-full text-sm border border-border/60 rounded-lg">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-2 text-left">Amount (KSh)</th>
                      <th className="px-4 py-2 text-left">Service Charge (KSh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr><td className="px-4 py-2">0 – 1,000</td><td className="px-4 py-2">10</td></tr>
                    <tr><td className="px-4 py-2">1,001 – 2,000</td><td className="px-4 py-2">20</td></tr>
                    <tr><td className="px-4 py-2">2,001 – 3,000</td><td className="px-4 py-2">30</td></tr>
                    <tr><td className="px-4 py-2">3,001 – 4,000</td><td className="px-4 py-2">40</td></tr>
                    <tr><td className="px-4 py-2">4,001 – Above</td><td className="px-4 py-2">50</td></tr>
                  </tbody>
                </table>
              </div>
              <OL start={3}>
                <LI>
                  a Delivery Fee, calculated as a base charge of Kenya Shillings
                  Sixty Five (Kshs 65) for a distance of up to one point eight
                  (1.8) kilometers, and an additional Kenya Shillings Thirty Five
                  (Kshs 35) for every kilometer travelled beyond the initial one
                  point eight (1.8) kilometer radius, with the total distance and
                  fee being calculated at the point of order placement using
                  Google location services; and
                </LI>
                <LI>
                  any and all transaction costs levied by the Customer’s chosen
                  payment provider.
                </LI>
              </OL>
              <P>
                The Customer hereby authorizes Soal to facilitate the payment
                for the total amount due through the integrated payment
                channels. Refunds, where applicable, shall be processed to the
                original M-Pesa or Account Number used for the transaction.
              </P>
            </>
          ),
        },
        {
          heading: "Advertising Platform for Services",
          body: (
            <UL>
              <LI>
                The App provides an advertising platform for service providers
                to list their services to Customers.
              </LI>
              <LI>
                Customers may access contact information of service providers
                through the App and may call them directly at no cost through
                the App’s integrated communication features.
              </LI>
              <LI>
                Soal facilitates the connection between Customers and Service
                Providers but does not guarantee the quality, outcome, or
                completion of any services arranged through the App.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Delivery Terms and Logistics",
          body: (
            <UL>
              <LI>
                Soal provides an estimated target delivery time; however, the
                Customer acknowledges and agrees that this is an estimate only
                and not a guaranteed time frame. Soal shall not be liable for any
                delays occasioned by traffic, weather, or other extenuating
                circumstances.
              </LI>
              <LI>
                The Customer may track the status and location of their Order in
                real-time using the ‘Trackit’ feature within the App. The
                Customer may also contact the assigned Rider for the sole
                purpose of facilitating delivery via the phone number displayed
                within the ‘Trackit’ feature during the active delivery window.
                This access is temporary and is revoked upon completion or
                cancellation of the delivery.
              </LI>
              <LI>
                The Customer warrants that they will be available at the
                provided delivery address to receive the Order. In the event of
                the Customer’s unavailability, the Rider shall return the goods
                to the Seller or Service Provider, and the Customer may be
                liable for the cost of the goods and associated delivery fees.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Product and Service Returns and Refunds",
          body: (
            <P>
              The Customer’s right to return goods or services and receive a
              refund is governed exclusively by Soal’s standalone Refund Policy,
              which is incorporated into these Terms by reference. The Customer
              may reject products at the point of delivery if they are visibly
              damaged, incorrect, or do not conform to the description provided
              on the App. For services, refunds shall be governed by the
              specific terms agreed between the Customer and the Service
              Provider.
            </P>
          ),
        },
        {
          heading:
            "Part C: Additional Terms for Sellers and Service Providers — Status and Obligations",
          body: (
            <UL>
              <LI>
                A Seller or Service Provider is an independent business that has
                entered into a separate Seller Partnership Agreement with Soal.
                The terms of that specific agreement govern the Seller’s or
                Service Provider’s relationship with Soal, including all
                provisions related to payments, fees, technology obligations,
                marketing support, and termination. In the event of any conflict
                between these Terms and the Seller Partnership Agreement, the
                Seller Partnership Agreement shall prevail.
              </LI>
              <LI>
                By registering as a Seller or Service Provider on the SoQoni
                App, the Seller or Service Provider acknowledges that they have
                read, understood, and agreed to the terms of the Seller
                Partnership Agreement, including all obligations set forth
                therein.
              </LI>
              <LI>
                All Sellers and Service Providers must download the Seller
                Partnership Agreement from the SoQoni website, sign it, and send
                the signed copy to info@soqoni.co.ke and cc
                applications.sokoni@gmail.com before the relationship with Soal
                is finalized.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Technology Obligations",
          body: (
            <UL>
              <LI>
                The Seller or Service Provider must download the SoQoni Seller
                App on at least one (1) smartphone—and preferably more—to ensure
                they never miss an order. The Seller App is the primary tool for
                receiving orders, updating prices, and managing the Seller’s
                store.
              </LI>
              <LI>
                During the Seller’s stated business hours, the Seller App must
                remain active and logged in to receive order notifications. An
                inactive App may result in missed orders and negatively impact
                Customer experience.
              </LI>
              <LI>
                The Seller or Service Provider must accurately fill in their
                opening time, closing time, and working days of the week. This
                information guides Customer expectations and order assignments.
              </LI>
              <LI>
                If the Seller or Service Provider needs to close
                temporarily—for a holiday, emergency, or any other reason—they
                must update their working hours with Soal or mark themselves
                offline in the App. Customers should not be able to order when
                the Seller or Service Provider cannot fulfill.
              </LI>
              <LI>
                The Seller must provide an accurate M-Pesa number to receive
                payouts. If the number provided is wrong, inactive, or cannot
                receive payments, any delay or loss of funds is entirely the
                Seller’s responsibility.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Order Acceptance and Processing",
          body: (
            <>
              <P>
                When an order is received, the Seller must accept or reject it
                within ninety (90) seconds. Quick acceptance is essential to
                Customer satisfaction.
              </P>
              <P>
                Once an order is accepted, the Seller must prepare it promptly.
                The Customer tracks the Seller’s speed through the ‘Trackit’
                feature, which measures:
              </P>
              <OL>
                <LI>
                  Time from ‘Pending’ to ‘Confirmed’ (acceptance speed); and
                </LI>
                <LI>
                  Time from ‘Confirmed’ to ‘On the Way’ (packing or service
                  readiness speed).
                </LI>
              </OL>
              <P>
                Customers rate Sellers on Speed and Quality. Higher-rated
                Sellers and Service Providers receive priority in order
                assignments through the Proximity Matching Algorithm.
              </P>
            </>
          ),
        },
        {
          heading: "Product and Service Listings and Pricing",
          body: (
            <UL>
              <LI>
                The Seller or Service Provider may list products or services for
                sale, subject to Soal’s exclusive right to approve or disapprove
                any product or service at its sole discretion and without
                reference to the Seller or Service Provider.
              </LI>
              <LI>
                The prices displayed on the App must match the Seller’s in-store
                or in-person prices exactly. The Seller is solely responsible
                for updating prices whenever they change. If a Customer orders
                at an outdated lower price, the Seller must cover the
                difference.
              </LI>
              <LI>
                Consistently overpricing items or services on the App may result
                in the Seller’s or Service Provider’s removal from the platform.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Payments and Fees",
          body: (
            <UL>
              <LI>
                Sellers and Service Providers on the platform will not be
                charged platform fees until further notice. Soal shall provide
                notice of any future fee structure in advance.
              </LI>
              <LI>
                Payments shall be made per transaction to both Sellers and
                Riders. Money shall be paid once delivery is complete and
                confirmed.
              </LI>
              <LI>
                The Seller shall receive the full purchase price for all goods
                or services sold, less any applicable deductions.
              </LI>
              <LI>
                If refunds are issued due to the Seller’s error (damaged or
                incorrect goods, or unsatisfactory services), the amount shall
                be recovered from the Seller’s payouts.
              </LI>
              <LI>
                If items are lost during delivery and the Seller is clearly
                shown to have had no negligence, Soal shall cover the cost of the
                lost items.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Packaging and Delivery Materials",
          body: (
            <UL>
              <LI>
                The Seller or Service Provider is responsible for providing
                basic packaging for their products.
              </LI>
              <LI>
                Soal may, at its sole discretion, provide branded bags or
                baskets to the Seller or Service Provider. If provided:
              </LI>
            </UL>
          ),
        },
        {
          heading: "Marketing and Promotions",
          body: (
            <>
              <P>
                Soal invests in digital and physical marketing campaigns across
                every town it launches. The Seller’s or Service Provider’s
                offerings benefit from these campaigns. The Seller’s or Service
                Provider’s listing is featured in the App, providing free,
                permanent advertising to every Customer in their market.
              </P>
              <P>The Seller or Service Provider must actively support Soal’s marketing initiatives, including but not limited to:</P>
              <OL>
                <LI>Following Soal’s social media platforms actively;</LI>
                <LI>
                  Helping distribute advertising bills, posters, and promotional
                  materials through their stores;
                </LI>
                <LI>
                  Being available for advertising videos, audio recordings, and
                  other promotional content to promote the App;
                </LI>
                <LI>
                  Displaying SoQoni promotional materials prominently in their
                  store or premises;
                </LI>
                <LI>
                  Participating in marketing exercises such as interviews,
                  testimonials, or featured spotlights when requested;
                </LI>
                <LI>
                  Sharing SoQoni content on their personal or business social
                  media pages;
                </LI>
                <LI>
                  Speaking positively about SoQoni to their customers and
                  encouraging them to download and use the App; and
                </LI>
                <LI>
                  Notifying Soal of any community events where SoQoni could
                  participate or sponsor.
                </LI>
              </OL>
              <P>
                Soal’s video/photography team may visit to take product photos.
                The Seller or Service Provider must welcome and support them, as
                these images are marketing tools that enhance the Seller’s or
                Service Provider’s online presence. The Seller may create
                special offers on the App to attract more customers. Soal’s
                trainers will provide technical skills to assist with this.
              </P>
            </>
          ),
        },
        {
          heading: "Training and Support",
          body: (
            <P>
              Soal shall provide trainers to assist Sellers with: (a) uploading
              product prices and service rates for the first time; (b) learning
              to update prices and rates independently; (c) setting up
              promotions and offers; and (d) understanding how to manage App
              settings, including working hours.
            </P>
          ),
        },
        {
          heading: "Responsibility to Read and Understand",
          body: (
            <P>
              The Seller or Service Provider is responsible for reading and
              understanding the full SoQoni App Terms and Conditions, Privacy
              Policy, Refund Policy, and the Seller Partnership Agreement. These
              documents contain important information about the Seller’s or
              Service Provider’s rights and obligations. If the Seller or
              Service Provider does not understand any part, they must seek
              clarification from Soal before proceeding.
            </P>
          ),
        },
        {
          heading: "Agent Codes and Recruitment",
          body: (
            <UL>
              <LI>
                Sellers and Service Providers may be assigned Agent codes by
                Soal to become Agents for the purpose of recruiting new
                Customers.
              </LI>
              <LI>
                The terms, conditions, and rates of compensation for recruitment
                activities shall be described upon issuance of the Agent code.
              </LI>
              <LI>
                Soal reserves the right to revoke or modify Agent codes and
                associated compensation rates at its sole discretion.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Removal of Seller or Service Provider",
          body: (
            <>
              <P>Soal may remove a Seller or Service Provider from the App if they:</P>
              <UL>
                <LI>Repeatedly sell low-quality or damaged goods, or provide unsatisfactory services;</LI>
                <LI>Consistently overprice items or services;</LI>
                <LI>
                  (Sellers) Fail to keep the Seller App active during working
                  hours, causing missed orders;
                </LI>
                <LI>Refuse to cooperate with reasonable marketing requests;</LI>
                <LI>
                  Fail to comply with the contract signing and submission
                  requirements; or
                </LI>
                <LI>
                  Otherwise violate these Terms or the Seller Partnership
                  Agreement after warnings.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading:
            "Part D: Additional Terms for Riders — Independent Contractor Status and Requirements",
          body: (
            <UL>
              <LI>
                It is expressly understood and agreed by both parties that the
                Rider is an independent contractor engaged by Soal on a casual,
                order-by-order basis. Nothing in these Terms shall be construed
                to create an employment, agency, partnership, or joint venture
                relationship between the Rider and Soal. The Rider is solely
                responsible for their own taxes, insurance, and statutory
                deductions.
              </LI>
              <LI>
                The Rider represents and warrants that they possess and will
                maintain throughout the term of their engagement a valid
                motorcycle riding license, a valid insurance policy, and all
                other permits required by law to operate a delivery service
                within the Republic of Kenya. The Rider must provide their full
                name, National ID number, and valid riding license number during
                registration.
              </LI>
              <LI>
                The Rider must activate the “Available” mode within the App to
                receive delivery assignments, maintain accurate location
                services, and must accept or reject any assigned Order within
                ninety (90) seconds of its notification.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Delivery Operations and Data Privacy",
          body: (
            <UL>
              <LI>
                The Rider shall undertake one (1) Order per delivery trip and
                shall not combine Orders from different transactions. A single
                Order may, however, require pickups from multiple Sellers within
                the same market area or across different markets.
              </LI>
              <LI>
                The Rider will be granted temporary access to the Customer’s
                precise delivery address and contact phone number strictly for
                the duration of the active delivery assignment and solely for
                the purpose of fulfilling said delivery. Upon confirmation of
                delivery completion or cancellation of the assignment, the
                Rider’s access to this confidential information shall be
                permanently revoked within the App.
              </LI>
              <LI>
                The Rider agrees to handle all goods with a high standard of
                care. The Rider shall be financially liable and surcharged for
                the full retail value of any goods that are lost or damaged due
                to their proven negligence, mishandling, or failure to exercise
                reasonable care during the delivery process.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Rider Earnings and Performance Management",
          body: (
            <>
              <P>
                Soal shall pay the Rider for delivery services rendered as
                follows: a base payment of Kenya Shillings Fifty (Kshs 50) for
                any delivery ride covering a distance of up to one point eight
                (1.8) kilometers, and an additional payment of Kenya Shillings
                Twenty-Seven Point Five (Kshs 27.5) for every kilometer travelled
                beyond the initial one point eight (1.8) kilometer radius per
                trip.
              </P>
              <P>By way of illustration, a delivery of six (6) kilometers shall be calculated as follows:</P>
              <UL>
                <LI>Base fee for first 1.8 kilometers: Kshs 50</LI>
                <LI>Additional 4.2 kilometers at Kshs 27.5 per kilometer: Kshs 115.5</LI>
                <LI>Total Rider earnings for the delivery: Kshs 165.5</LI>
              </UL>
              <P>
                Payments shall be made per transaction. Money shall be paid once
                delivery is complete and confirmed. The Rider’s final payout
                shall include, and therefore automatically deduct, the value of
                any surcharges levied against the Rider during the course of the
                week for lost or damaged goods or other penalties as stipulated
                in these Terms. The Rider’s service is subject to a star-rating
                system based on Customer feedback. A Rider who consistently
                receives an average rating below two (2) stars, or who frequently
                declines assignments, cancels accepted orders, or otherwise
                fails to meet the service standards set forth in these Terms,
                may be subject to penalties, temporary suspension, or permanent
                removal from the App at the sole discretion of Soal.
              </P>
            </>
          ),
        },
        {
          heading: "Rider Liability and Insurance",
          body: (
            <P>
              The Rider, as an independent contractor, is personally and solely
              liable for any and all accidents, incidents, traffic violations,
              personal injuries, or property damage that occur while they are
              operating their vehicle, whether before, during, or after the
              completion of a delivery assignment. The Rider acknowledges and
              agrees that Soal assumes no liability whatsoever for the Rider’s
              actions, omissions, or the condition and roadworthiness of their
              vehicle.
            </P>
          ),
        },
        {
          heading: "Part E: Final Provisions — Termination",
          body: (
            <UL>
              <LI>
                Either party may terminate this agreement in accordance with the
                notice provisions set forth in any specific agreement between
                them, such as the Seller Partnership Agreement.
              </LI>
              <LI>
                Soal may terminate or suspend any User’s access to the Services
                immediately without prior notice or liability for any reason,
                including without limitation if the User breaches these Terms.
              </LI>
              <LI>
                Upon termination, the User’s right to use the Services will
                immediately cease.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Governing Law and Dispute Resolution",
          body: (
            <UL>
              <LI>
                This Agreement shall be governed by, construed, and enforced in
                accordance with the substantive laws of the Republic of Kenya,
                without regard to its conflict of law principles.
              </LI>
              <LI>
                Any dispute, controversy, or claim arising out of or relating to
                these Terms, or the breach, termination, or invalidity thereof,
                shall be settled first through amicable negotiations between the
                parties. Should such negotiations fail, the parties hereby
                irrevocably submit to the exclusive jurisdiction of the competent
                courts of the Republic of Kenya.
              </LI>
            </UL>
          ),
        },
        {
          heading: "Contact Information",
          body: (
            <>
              <P>
                Any notices, queries, or complaints regarding these Terms or the
                Services should be directed to:
              </P>
              <div className="rounded-xl bg-card border border-border/60 p-4 mt-3">
                <P>
                  <strong>Sokoni Applications Ltd (Soal)</strong>
                  <br />
                  Kitengela, Red Heron Mall, Room 19D
                </P>
                <P className="mb-0">
                  Email: applications.sokoni@gmail.com; info@soqoni.co.ke
                  <br />
                  Phone: 0748237799
                  <br />
                  Website: www.soqoni.co.ke
                  <br />
                  Social Media: @soqoniapp1
                </P>
              </div>
              <P className="mt-4 italic text-muted-foreground">
                SoQoni — Bringing All Your Markets to You.
              </P>
            </>
          ),
        },
      ]}
    />
  );
}
