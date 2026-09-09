import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  P,
  UL,
  LI,
  Sub,
} from "@/components/legal-page";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Sokonyumbani" },
      {
        name: "description",
        content:
          "The SoQoni App Refund Policy: eligibility, claim procedures, and the financial obligations of Customers, Sellers, Service Providers, and Riders.",
      },
      { property: "og:title", content: "Refund Policy — Sokonyumbani" },
      {
        property: "og:description",
        content:
          "The SoQoni App Refund Policy: eligibility, claim procedures, and the financial obligations of Customers, Sellers, Service Providers, and Riders.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalPage
      title="SOQONI APP REFUND POLICY"
      lastUpdated="18 May 2026"
      effectiveDate="18 June 2026"
      intro={
        <P>
          This Refund Policy forms an integral part of the SoQoni App Terms and
          Conditions and the contractual agreement between you, the user, and
          Sokoni Applications Ltd (“Soal”). It sets out the terms, conditions,
          procedures, and obligations governing the return of goods and services
          and the processing of refunds for all transactions conducted through
          the SoQoni App.
        </P>
      }
      sections={[
        {
          heading: "1. Preamble and Acceptance of Policy",
          body: (
            <>
              <P>
                <strong>1.1.</strong> This Refund Policy (“Policy”) constitutes
                an integral part of the SoQoni App Terms and Conditions and the
                contractual agreement between you, the user (“you,” “your”), and
                Sokoni Applications Ltd (hereinafter referred to as “Soal,”
                “Company,” “we,” “us,” “our”). This Policy sets forth the terms,
                conditions, procedures, and obligations governing the return of
                goods and services and the processing of refunds for all
                transactions conducted through the SoQoni App (“App”).
              </P>
              <P>
                <strong>1.2.</strong> By accessing, registering for, or
                utilizing the Services provided by the SoQoni App, you
                explicitly acknowledge that you have read, understood, and
                irrevocably agree to be bound by the stipulations contained
                within this Policy. This Policy applies distinctly to Customers,
                Sellers, Service Providers, and Riders, as defined in our Terms
                and Conditions, and outlines the specific financial
                responsibilities of each party in the event of a refund claim.
              </P>
            </>
          ),
        },
        {
          heading: "Part A: Refunds for Customers",
          body: (
            <>
              <Sub>2. Eligibility Criteria for Customer Refunds</Sub>
              <P>
                <strong>2.1.</strong> A Customer may be eligible for a full or
                partial refund under the following explicitly defined
                circumstances, provided that the claim is substantiated with
                valid and verifiable evidence as further detailed herein:
              </P>
              <P>
                <strong>(a) Post-Delivery Product Deficiencies:</strong> Where,
                upon delivery, the Customer establishes that the goods received
                are:
              </P>
              <UL>
                <LI>
                  <strong>(i) Damaged or Defective:</strong> Goods that are
                  physically broken, spoiled, unusable, or otherwise unfit for
                  their intended purpose.
                </LI>
                <LI>
                  <strong>(ii) Incorrect:</strong> Goods that do not match the
                  description, type, quantity, or brand as explicitly listed on
                  the App and ordered by the Customer.
                </LI>
                <LI>
                  <strong>(iii) Not as Described:</strong> Goods that exhibit a
                  significant and material discrepancy from the product
                  description or images provided on the App.
                </LI>
              </UL>
              <P>
                <strong>(b) Service-Related Refunds:</strong> Where a Customer
                has engaged a Service Provider through the App and the service
                provided is unsatisfactory, the Customer must resolve the matter
                directly with the Service Provider. Soal does not participate
                in, monitor, or have access to any communications or
                negotiations between Customers and Service Providers. The terms
                of service, including pricing, timing, location, and quality,
                are agreed upon entirely between the Customer and the Service
                Provider without any involvement from Soal. Refunds for services
                are therefore the sole responsibility of the Service Provider.
              </P>

              <Sub>3. Customer Refund Request Procedure</Sub>
              <P>
                <strong>3.1.</strong> To initiate a valid refund claim for
                goods, the Customer must adhere strictly to the following
                mandatory procedure:
              </P>
              <UL>
                <LI>
                  <strong>(a) Timely Notification:</strong> The Customer must
                  file a formal claim through the designated channel within the
                  SoQoni App within two (2) hours of the recorded delivery time.
                  Claims submitted after this two-hour window shall be deemed
                  invalid and will not be processed.
                </LI>
                <LI>
                  <strong>(b) Submission of Evidence:</strong> The Customer is
                  obligated to provide clear, timestamped, and unaltered
                  photographic or video evidence that substantiates the claimed
                  deficiency. This evidence must unequivocally demonstrate the
                  damage, defect, or discrepancy of the delivered goods.
                </LI>
                <LI>
                  <strong>(c) Company Review:</strong> Upon receipt of a claim
                  and its accompanying evidence, Soal shall initiate a review
                  process. This process may involve communication with the
                  involved Seller and Rider. Soal reserves the sole and absolute
                  right to determine the validity of a claim based on the
                  evidence presented. This review shall be completed within a
                  period of twenty-four (24) to forty-eight (48) business hours.
                </LI>
                <LI>
                  <strong>(d) Approval and Processing:</strong> If the claim is
                  approved, Soal will initiate the refund to the original M-Pesa
                  number used for the transaction. The Customer acknowledges and
                  agrees that the processing of the refund may take three (3) to
                  five (5) business days to reflect in their account, depending
                  on the policies of the payment processor.
                </LI>
              </UL>

              <Sub>4. Non-Refundable Circumstances for Customers</Sub>
              <P>
                <strong>4.1.</strong> Notwithstanding any other provision in
                this Policy, the Customer explicitly agrees that no refund shall
                be granted under the following circumstances:
              </P>
              <UL>
                <LI>
                  (a) A mere change of mind or personal preference regarding a
                  product after the purchase has been completed.
                </LI>
                <LI>
                  (b) Minor imperfections in product packaging that do not affect
                  the quality, integrity, or utility of the product itself.
                </LI>
                <LI>
                  (c) Delivery delays of forty (40) minutes or less beyond the
                  estimated delivery time provided by the App.
                </LI>
                <LI>
                  (d) Incorrect or incomplete orders resulting from an
                  inaccurate, insufficient, or erroneous delivery address
                  provided by the Customer.
                </LI>
                <LI>
                  (e) The Customer’s failure to be available at the provided
                  delivery address to receive the order, resulting in a failed
                  delivery.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part B: Financial Obligations of Sellers",
          body: (
            <>
              <Sub>5. Seller Liability in Refund Scenarios</Sub>
              <P>
                <strong>5.1.</strong> The Seller acknowledges and accepts full
                financial responsibility for refunds arising from deficiencies
                that are attributable to their actions, omissions, or the
                condition of the goods they supply.
              </P>
              <UL>
                <LI>
                  <strong>(a) Cost of Refunded Goods:</strong> Where a refund is
                  approved for a reason falling under Section 2.1(b) of this
                  Policy, the Seller shall be liable for the full purchase price
                  of the refunded product(s). This amount shall be automatically
                  deducted from the Seller’s subsequent payout.
                </LI>
                <LI>
                  <strong>(b) Commission Reversal:</strong> Any platform fees
                  charged by Soal on the refunded order shall be waived. Soal
                  will absorb this cost.
                </LI>
                <LI>
                  <strong>(c) Cost of Replacement Delivery:</strong> In
                  instances where a replacement delivery is required for an
                  approved claim, the Seller shall bear the full cost of the
                  subsequent delivery fee.
                </LI>
                <LI>
                  <strong>(d) Surcharges:</strong> Soal reserves the right to
                  levy additional administrative surcharges against a Seller in
                  cases of repeated or fraudulent refund claims linked to their
                  store, which shall also be deducted from future payouts.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part C: Financial Obligations of Service Providers",
          body: (
            <>
              <Sub>6. Service Provider Liability in Refund Scenarios</Sub>
              <P>
                <strong>6.1.</strong> The Service Provider acknowledges and
                accepts full financial responsibility for refunds arising from
                deficiencies that are attributable to their actions, omissions,
                or the quality of the services they provide.
              </P>
              <UL>
                <LI>
                  <strong>(a) Service Refunds:</strong> Where a Customer
                  requests a refund for unsatisfactory services, the Service
                  Provider shall handle the matter directly with the Customer.
                  Soal does not facilitate or mediate service refunds.
                </LI>
                <LI>
                  <strong>(b) Platform Role:</strong> Soal merely provides an
                  advertising platform for Service Providers. The Company does
                  not participate in, monitor, or have access to any
                  communications or negotiations between Customers and Service
                  Providers. The terms of service, including pricing, timing,
                  location, and quality, are agreed upon entirely between the
                  Customer and the Service Provider without any involvement from
                  Soal.
                </LI>
                <LI>
                  <strong>(c) Disputes:</strong> Any disputes regarding service
                  quality or refunds shall be resolved directly between the
                  Customer and the Service Provider, without the involvement of
                  Soal.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part D: Financial Obligations of Riders",
          body: (
            <>
              <Sub>7. Rider Liability for Damaged Goods</Sub>
              <P>
                <strong>7.1.</strong> The Rider, as an independent contractor, is
                personally and solely responsible for exercising due care and
                diligence in the handling and transportation of all goods
                entrusted to them for delivery.
              </P>
              <UL>
                <LI>
                  <strong>(a) Surcharge for Negligence:</strong> In the event
                  that goods are lost or damaged during transit due to the
                  proven negligence, mishandling, or improper conduct of the
                  Rider, the Rider shall be surcharged for the full retail value
                  of the lost or damaged goods.
                </LI>
                <LI>
                  <strong>(b) Deduction from Earnings:</strong> The amount of the
                  surcharge shall be automatically deducted from the Rider’s
                  earnings during the payout cycle in which the claim was
                  validated and approved by Soal.
                </LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part E: General Refund Provisions",
          body: (
            <>
              <Sub>8. Refund Amounts and Fee Treatment</Sub>
              <P>
                <strong>8.1.</strong> The specific amount to be refunded to a
                Customer shall be determined based on the nature and fault of the
                claim:
              </P>
              <UL>
                <LI>
                  <strong>(a) Full Refund:</strong> A full refund of the product
                  price, Service Charge, and Delivery Fee will be processed in
                  cases where the fault lies unequivocally with Soal, the Seller,
                  or the Rider.
                </LI>
                <LI>
                  <strong>(b) Partial Refund:</strong> A partial refund, limited
                  to the value of the specific deficient product(s), may be
                  issued in cases where only part of an order is problematic and
                  the Delivery Fee is deemed justified.
                </LI>
                <LI>
                  <strong>(c) Promotional Credits:</strong> Any refunds for
                  transactions that involved the use of promotional credits or
                  vouchers shall be processed as platform credits, which shall be
                  valid for a period of ninety (90) days from the date of
                  issuance.
                </LI>
              </UL>

              <Sub>9. Dispute Resolution and Financial Discrepancies</Sub>
              <P>
                <strong>9.1.</strong> Any User who wishes to dispute a financial
                deduction, a refused refund, or any other decision made under
                this Policy must lodge a formal complaint with Soal’s support
                team at 0748237799 or via email at info@soqoni.co.ke within seven
                (7) calendar days of the transaction or decision in question.
              </P>
              <P>
                <strong>9.2.</strong> Soal will endeavor to resolve all disputes
                amicably. Should an amicable resolution not be achieved, the
                matter shall be escalated in accordance with the Dispute
                Resolution clause of the SoQoni App Terms and Conditions, which
                provides for the exclusive jurisdiction of the courts of the
                Republic of Kenya.
              </P>

              <Sub>10. Service Hours and Policy Updates</Sub>
              <P>
                <strong>10.1. Customer Support Hours:</strong> Refund requests
                and related customer support inquiries will be handled during our
                official business hours, which are from 8:00 AM to 5:00 PM,
                Monday through Sunday, including public holidays. Requests
                received outside of these hours will be logged and addressed at
                the commencement of the next business cycle.
              </P>
              <P>
                <strong>10.2. Policy Modifications:</strong> Soal reserves the
                right to amend, modify, or update this Policy at any time at its
                sole discretion. Any such changes will be communicated to Users
                via in-app notifications and/or SMS. Your continued use of the App
                following such notification constitutes your binding acceptance
                of the revised Policy.
              </P>
            </>
          ),
        },
        {
          heading: "11. Contact Information",
          body: (
            <>
              <P>
                If you have any questions, concerns, or requests regarding this
                Refund Policy, please contact us at:
              </P>
              <P>
                <strong>Sokoni Applications Ltd (Soal)</strong>
                <br />
                Kitengela, Red Heron Mall, Room 19D
                <br />
                Email: info@soqoni.co.ke; applications.sokoni@gmail.com
                <br />
                Phone: 0748237799 (Call Center/Customer Support)
                <br />
                Website: www.soqoni.co.ke
              </P>
              <P>
                We are committed to working with you to obtain a fair resolution
                of any complaint or concern about refunds.
              </P>
              <P className="text-muted-foreground italic mt-4">
                SoQoni – Bringing All Your Markets to You.
              </P>
            </>
          ),
        },
      ]}
    />
  );
}
