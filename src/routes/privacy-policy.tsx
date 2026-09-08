import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  P,
  OL,
  UL,
  LI,
  Sub,
} from "@/components/legal-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Sokonyumbani" },
      {
        name: "description",
        content:
          "How Sokonyumbani collects, uses, and protects your personal data in line with the Kenya Data Protection Act, 2019.",
      },
      { property: "og:title", content: "Privacy Policy — Sokonyumbani" },
      {
        property: "og:description",
        content:
          "How Sokonyumbani collects, uses, and protects your personal data in line with the Kenya Data Protection Act, 2019.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="SOQONI APP PRIVACY POLICY"
      lastUpdated="18 May 2026"
      effectiveDate="18 June 2026"
      intro={
        <P>
          This Privacy Policy explains how Sokoni Applications Ltd (“Soal,”
          “we,” “us,” “our”) collects, uses, and protects your personal data
          when you use the SoQoni application and services. It is written in
          line with the Data Protection Act, No. 24 of 2019 of the Laws of
          Kenya.
        </P>
      }
      sections={[
        {
          heading: "1. Introduction and Scope",
          body: (
            <>
              <P>
                <strong>1.1.</strong> Sokoni Applications Ltd (hereinafter
                referred to as “Soal,” “we,” “us,” “our,” “Company”), the owner
                and operator of the SoQoni mobile application (“App”), is
                committed to protecting the privacy and security of your
                personal data. This Privacy Policy (“Policy”) outlines our
                practices concerning the collection, use, processing, storage,
                disclosure, and protection of the personal information of all
                users of our Services, including Customers, Sellers, Service
                Providers, and Riders (collectively, “you” or “your”).
              </P>
              <P>
                <strong>1.2.</strong> This Policy is formulated in strict
                adherence to the provisions of the Data Protection Act, No. 24
                of 2019 of the Laws of Kenya, and all subsequent regulations and
                guidelines issued thereunder (the “Act”). By accessing,
                downloading, registering for, or using the SoQoni App and its
                associated services (the “Services”), you explicitly acknowledge
                that you have read, understood, and hereby provide your
                informed and unequivocal consent to the practices described in
                this Policy. If you do not agree with any term of this Policy,
                you must immediately cease all use of the App and Services.
              </P>
            </>
          ),
        },
        {
          heading: "2. Definitions",
          body: (
            <>
              <P>
                For the purposes of this Policy, the following terms shall
                have the meanings ascribed to them:
              </P>
              <UL>
                <LI>
                  <strong>“Personal Data”</strong> shall have the meaning given
                  in the Data Protection Act and includes any information
                  relating to an identified or identifiable natural person.
                </LI>
                <LI>
                  <strong>“Data Subject”</strong> means an individual who is the
                  subject of Personal Data.
                </LI>
                <LI>
                  <strong>“Processing”</strong> encompasses any operation or set
                  of operations which is performed on Personal Data, such as
                  collection, recording, organization, structuring, storage,
                  adaptation, alteration, retrieval, consultation, use,
                  disclosure by transmission, dissemination, alignment,
                  combination, restriction, erasure, or destruction.
                </LI>
                <LI>
                  <strong>“Data Controller”</strong> refers to Sokoni
                  Applications Ltd (Soal), which determines the purpose and means
                  of the Processing of Personal Data.
                </LI>
                <LI>
                  <strong>“Data Processor”</strong> means a natural or legal
                  person, public authority, agency, or other body which
                  processes Personal Data on behalf of the Data Controller.
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
                  to Customers through the App.
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
              </UL>
            </>
          ),
        },
        {
          heading: "3. The Categories of Personal Data We Collect",
          body: (
            <>
              <P>
                <strong>3.1.</strong> In the course of providing our Services,
                we may collect, use, store, and transfer different kinds of
                Personal Data about you, which we have grouped as follows:
              </P>
              <Sub>
                Identity and Contact Data
              </Sub>
              <P>
                This includes, but is not limited to, your full name, username
                or similar identifier, title, residential and/or business
                address, email address, and telephone numbers.
              </P>
              <Sub>Profile and Transaction Data</Sub>
              <P>
                This encompasses your order history, preferences, feedback and
                survey responses, details of products and services you have
                purchased or sold through the App, and information about the
                delivery of such products and services.
              </P>
              <Sub>Financial and Payment Data</Sub>
              <P>
                This includes bank account details, M-Pesa numbers, Till
                Numbers, and other necessary payment instrument details required
                to process transactions, facilitate payouts, and administer
                refunds. Please note that while we facilitate payment
                processing, we utilize third-party payment processors, and we do
                not store your full payment card details on our servers.
              </P>
              <Sub>Technical and Usage Data</Sub>
              <P>
                This includes your internet protocol (IP) address, your login
                data, browser type and version, time zone setting and location,
                operating system and platform, and other technology on the
                devices you use to access the App. It also includes information
                about how you use our App and Services.
              </P>
              <Sub>Location Data</Sub>
              <P>
                We collect and process real-time, precise geolocation data from
                your mobile device. For Riders, this is essential for the
                real-time tracking of deliveries and for the functioning of the
                Proximity Matching Algorithm. For Customers, this is used to
                determine your market segment and delivery address. For
                Sellers, this is used to verify your business location for the
                Proximity Matching Algorithm. You may disable location services
                through your device settings, but this will impair core
                functionalities of the App.
              </P>
              <Sub>Marketing and Communications Data</Sub>
              <P>
                This includes your preferences in receiving marketing and
                promotional materials from us and our third-party partners, as
                well as your communication preferences. It also includes records
                of your correspondence with us, including calls to our support
                line (0748237799) and messages through the App.
              </P>
              <Sub>Special Category Data (Riders)</Sub>
              <P>
                In order to verify the eligibility and legitimacy of our Rider
                partners, we require and process copies of government-issued
                identification documents, such as your National Identity Card,
                and your valid motorcycle riding license. This data is
                processed in accordance with Section 30 of the Data Protection
                Act, 2019, as it is necessary for the purpose of carrying out
                the obligations and exercising specific rights of the Data
                Controller or the Data Subject in the field of employment and
                social security law.
              </P>
            </>
          ),
        },
        {
          heading: "4. The Purposes for Which We Use Your Personal Data",
          body: (
            <>
              <P>
                <strong>4.1.</strong> We will only use your Personal Data when
                the law allows us to. Most commonly, we will use your Personal
                Data in the following circumstances:
              </P>
              <Sub>
                (a) Performance of a Contract
              </Sub>
              <P>
                Where we need to perform the contract we are about to enter
                into or have entered into with you. This includes:
              </P>
              <OL>
                <LI>Registering you as a new user and creating your account.</LI>
                <LI>
                  Processing and delivering your orders, including managing
                  payments, fees, and charges.
                </LI>
                <LI>
                  Facilitating the matching of Customers with Sellers, Service
                  Providers, and Riders.
                </LI>
                <LI>
                  Communicating with you regarding your orders, account, or our
                  Services.
                </LI>
              </OL>
              <Sub>(b) Legitimate Interests</Sub>
              <P>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests. This includes:
              </P>
              <OL>
                <LI>
                  Administering and protecting our business and the App
                  (including troubleshooting, data analysis, testing, system
                  maintenance, support, reporting, and hosting of data).
                </LI>
                <LI>
                  Using data analytics to improve our App, Services, marketing,
                  customer relationships, and experiences.
                </LI>
                <LI>
                  Detecting and preventing fraud, financial crime, and
                  unauthorized activities.
                </LI>
              </OL>
              <Sub>(c) Legal Obligation</Sub>
              <P>
                Where we need to comply with a legal or regulatory obligation,
                such as retaining business records for tax purposes or providing
                information to law enforcement agencies upon a valid request.
              </P>
              <Sub>(d) Consent</Sub>
              <P>
                Where you have provided your explicit, informed, and unambiguous
                consent for a specific purpose, such as receiving direct
                marketing communications via email or SMS. You have the right
                to withdraw this consent at any time by contacting us or
                adjusting your preferences in the App settings.
              </P>
            </>
          ),
        },
        {
          heading: "5. Disclosure of Your Personal Data",
          body: (
            <>
              <P>
                <strong>5.1.</strong> We may share your Personal Data with the
                following categories of recipients for the purposes set out in
                this Policy:
              </P>
              <Sub>Other Users of the Service</Sub>
              <P>
                As an integral part of the Service, it is necessary to share
                limited Personal Data between Users to facilitate a
                transaction.
              </P>
              <UL>
                <LI>
                  <strong>To Sellers:</strong> Upon order placement, a Seller
                  will receive information necessary to fulfill the order,
                  which includes the specific items purchased and the
                  Customer’s delivery address.
                </LI>
                <LI>
                  <strong>To Service Providers:</strong> Upon a Customer
                  expressing interest in a service listing, the Service Provider
                  will receive the Customer’s contact information solely for the
                  purpose of facilitating the service engagement. Soal does not
                  participate in, monitor, or have access to any communications
                  or negotiations between Customers and Service Providers. The
                  terms of service, including pricing, timing, and location, are
                  agreed upon entirely between the Customer and the Service
                  Provider without any involvement from Soal.
                </LI>
                <LI>
                  <strong>To Riders:</strong> To facilitate delivery, a Rider
                  will be provided with the Customer’s delivery address and
                  contact phone number. This access is strictly limited to the
                  duration of the active delivery assignment and is revoked
                  upon completion or cancellation of the delivery.
                </LI>
                <LI>
                  <strong>To Customers:</strong> During an active delivery, a
                  Customer will be provided with the Rider’s first name and
                  contact phone number for the sole purpose of coordinating the
                  delivery.
                </LI>
              </UL>
              <Sub>Third-Party Service Providers (Data Processors)</Sub>
              <P>
                We engage carefully selected third-party companies and
                individuals to perform functions on our behalf. These entities
                are contractually obligated to process your data only in
                accordance with our instructions and for the specified
                purposes, and to maintain appropriate security measures. These
                include:
              </P>
              <UL>
                <LI>
                  <strong>Payment Processors:</strong> (e.g., M-Pesa) to
                  securely facilitate financial transactions.
                </LI>
                <LI>
                  <strong>Cloud Storage and IT Service Providers:</strong>{" "}
                  (e.g., Amazon Web Services, Google Cloud Platform) for data
                  hosting and infrastructure.
                </LI>
                <LI>
                  <strong>Analytics Providers:</strong> (e.g., Google Analytics,
                  Firebase) to help us understand how our App is used.
                </LI>
                <LI>
                  <strong>Communication Services:</strong> (e.g., Africa’s
                  Talking, Twilio) to manage SMS and in-app notifications.
                </LI>
                <LI>
                  <strong>Mapping Services:</strong> (e.g., Google Maps
                  Platform) to provide location-based services, including
                  calculating delivery fees and enabling real-time tracking.
                </LI>
              </UL>
              <Sub>Legal and Regulatory Authorities</Sub>
              <P>
                We may disclose your Personal Data to comply with a legal
                obligation, to protect and defend our rights or property, to
                prevent or investigate possible wrongdoing in connection with
                the Service, to protect the personal safety of users of the
                Service or the public, or to protect against legal liability, in
                accordance with the law.
              </P>
            </>
          ),
        },
        {
          heading: "6. International Transfers of Your Personal Data",
          body: (
            <P>
              <strong>6.1.</strong> We primarily store and process your Personal
              Data on servers located within the Republic of Kenya. However,
              some of our third-party service providers may be located in, or
              have operations in, countries outside of Kenya. In such cases, we
              will ensure that appropriate safeguards, as required by the Data
              Protection Act, are in place to protect your Personal Data. This
              may include the use of standard contractual clauses approved by the
              relevant authorities.
            </P>
          ),
        },
        {
          heading: "7. Data Security and Retention",
          body: (
            <>
              <P>
                <strong>7.1. Data Security:</strong> We have implemented and
                will maintain appropriate technical and organizational security
                measures designed to protect your Personal Data against
                accidental, unauthorized, or unlawful loss, access, destruction,
                alteration, disclosure, or use. These measures include
                encryption of data in transit and at rest, strict access
                controls, and secure server infrastructure.
              </P>
              <P>
                <strong>7.2. Data Retention:</strong> We will only retain your
                Personal Data for as long as reasonably necessary to fulfill the
                purposes we collected it for, including for the purposes of
                satisfying any legal, accounting, or reporting requirements. To
                determine the appropriate retention period, we consider the
                amount, nature, and sensitivity of the Personal Data, the
                potential risk of harm from unauthorized use or disclosure, the
                purposes for which we process it, and whether we can achieve
                those purposes through other means. Upon the expiry of the
                retention period, or upon your valid request where applicable,
                your Personal Data will be securely deleted or anonymized.
              </P>
            </>
          ),
        },
        {
          heading:
            "8. Your Legal Rights Under the Data Protection Act, 2019",
          body: (
            <>
              <P>
                <strong>8.1.</strong> As a Data Subject, you have the following
                rights regarding your Personal Data:
              </P>
              <UL>
                <LI>
                  <strong>The right to access:</strong> You have the right to
                  request copies of the Personal Data we hold about you.
                </LI>
                <LI>
                  <strong>The right to correction:</strong> You have the right
                  to request that we correct any information you believe is
                  inaccurate or complete any information you believe is
                  incomplete.
                </LI>
                <LI>
                  <strong>
                    The right to erasure (“the right to be forgotten”):
                  </strong>{" "}
                  You have the right to request that we erase your Personal
                  Data, under certain conditions stipulated by the Act.
                </LI>
                <LI>
                  <strong>The right to restrict processing:</strong> You have
                  the right to request that we restrict the processing of your
                  Personal Data, under certain conditions.
                </LI>
                <LI>
                  <strong>The right to object to processing:</strong> You have
                  the right to object to our processing of your Personal Data,
                  under certain conditions.
                </LI>
                <LI>
                  <strong>The right to data portability:</strong> You have the
                  right to request that we transfer the data that we have
                  collected to another organization, or directly to you, in a
                  structured, machine-readable format.
                </LI>
              </UL>
              <P>
                <strong>8.2.</strong> To exercise any of these rights, please
                contact us using the details provided in Section 10 below. We
                may need to request specific information from you to help
                confirm your identity and ensure your right to access your
                Personal Data (or to exercise any of your other rights). This is
                a security measure to ensure that Personal Data is not disclosed
                to any person who has no right to receive it.
              </P>
            </>
          ),
        },
        {
          heading: "9. Changes to This Privacy Policy",
          body: (
            <P>
              <strong>9.1.</strong> We may update this Policy from time to time
              to reflect changes in our practices, technology, legal
              requirements, or other reasons. The “Last Updated” date at the top
              of this Policy will indicate when the latest revisions were made.
              We will notify you of any material changes through a prominent
              notice on the App or via email prior to the change becoming
              effective. Your continued use of the Services after such
              notification constitutes your acknowledgment and acceptance of the
              revised Policy.
            </P>
          ),
        },
        {
          heading: "10. Contact Us and Data Protection Officer",
          body: (
            <>
              <P>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data protection practices, or if you wish
                to exercise any of your legal rights, please contact us at:
              </P>
              <div className="rounded-xl bg-card border border-border/60 p-4 mt-3">
                <P>
                  <strong>Sokoni Applications Ltd (Soal)</strong>
                  <br />
                  Kitengela, Red Heron Mall, Room 19D
                </P>
                <P className="mb-0">
                  Email: info@soqoni.co.ke; applications.sokoni@gmail.com
                  <br />
                  Phone: 0748237799
                  <br />
                  Website: www.soqoni.co.ke
                </P>
              </div>
              <P className="mt-4 italic text-muted-foreground">
                We are committed to working with you to obtain a fair resolution
                of any complaint or concern about privacy.
              </P>
            </>
          ),
        },
      ]}
    />
  );
}
