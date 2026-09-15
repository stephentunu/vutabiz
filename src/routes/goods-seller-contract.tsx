import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  P,
  UL,
  LI,
  Sub,
} from "@/components/legal-page";

export const Route = createFileRoute("/goods-seller-contract")({
  head: () => ({
    meta: [
      { title: "Goods Seller Contract — Sokonyumbani" },
      {
        name: "description",
        content:
          "The SoQoni Goods Seller Contract between Sokoni Applications Ltd and store owners selling goods through the SoQoni App.",
      },
      { property: "og:title", content: "Goods Seller Contract — Sokonyumbani" },
      {
        property: "og:description",
        content:
          "The SoQoni Goods Seller Contract between Sokoni Applications Ltd and store owners selling goods through the SoQoni App.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GoodsSellerContractPage,
});

function GoodsSellerContractPage() {
  return (
    <LegalPage
      title="SOQONI GOODS SELLER CONTRACT"
      lastUpdated="18 May 2026"
      effectiveDate="18 June 2026"
      intro={
        <>
          <P>
            <strong>BETWEEN:</strong>
            <br />
            Sokoni Applications Ltd (Soal) (the “Company”)
            <br />
            Kitengela, Red Heron Mall, Room F18
            <br />
            Phone: 0748237799 | Email: applications.sokoni@gmail.com |
            info@soqoni.co.ke | Website: www.soqoni.co.ke
          </P>
          <P>
            <strong>AND</strong>
            <br />
            _________________________________________________________ (the “Seller”)
            <br />
            Store Name: _________________________________________________________
            <br />
            Contact Person: _________________________________________________________
            <br />
            Phone: __________________________ | Email: __________________________
            <br />
            Date: __________________________
          </P>
        </>
      }
      sections={[
        {
          heading: "Part 1: Our Partnership",
          body: (
            <>
              <P>
                <strong>1.1 Who We Are.</strong> SoQoni is an App that brings
                local markets to customers' doorsteps. We connect you—the store
                owner—with customers in your neighborhood who want quality
                products delivered quickly and conveniently. The Company shall
                hereinafter be referred to as “Soal.”
              </P>
              <P>
                <strong>1.2 Why We Created This Partnership.</strong> We believe
                small and medium stores should not struggle alone. By coming
                together on one platform, we give you the power to compete with
                the big chains while keeping your unique identity. Your store
                name, your prices, your quality—now with a network behind you.
              </P>
              <P>
                <strong>1.3 Our Shared Goal.</strong> We succeed only when you
                succeed. Together, we grow one town at a time.
              </P>
            </>
          ),
        },
        {
          heading: "Part 2: Your Store on SoQoni",
          body: (
            <>
              <P>
                <strong>2.1 How Kitengela Is Organized.</strong> To ensure speed
                and convenience, Kitengela is divided into markets. Please tick
                the market(s) where your store is located:
              </P>
              <UL>
                <LI>☐ CBD</LI>
                <LI>☐ EPZ</LI>
                <LI>☐ Milimani</LI>
                <LI>☐ Yukos</LI>
                <LI>☐ Acacia</LI>
                <LI>☐ Korompoi</LI>
              </UL>
              <P>
                <strong>2.2 Shopping Across Markets.</strong> A customer can buy
                from the same market or from different markets in a single order.
                However, delivery is done as one order only—even if the order
                involves multiple stores and multiple markets. This keeps things
                simple and efficient.
              </P>
              <P>
                <strong>2.3 Your Products.</strong> You decide what to sell.
                However, Soal reserves the exclusive right to approve or
                disapprove certain products on the App. Some products may not be
                approved for sale, and this decision is made at our sole
                discretion without reference to you. This protects the quality
                and reputation of our platform.
              </P>
              <P>
                <strong>2.4 Competition.</strong> From the first day your store is
                listed on the App, you will face competition from other stores
                selling similar products. This is a healthy marketplace that
                rewards quality and speed. The best stores will naturally rise to
                the top.
              </P>
              <P>
                <strong>2.5 Your Prices.</strong> The prices on the App must match
                your in-store prices exactly. You are responsible for updating
                prices whenever they change. If a customer orders at an outdated
                lower price, you cover the difference. Consistently overpricing on
                the App may lead to removal. We promise fair value to our shared
                customers.
              </P>
              <P>
                <strong>2.6 Product Quality.</strong> We will check product
                quality regularly. We only want the best for our shared
                customers. If goods are damaged by you, or if you list damaged
                goods, any reimbursement to customers who reject them will be
                recovered from you. Consistent low quality or unavailability to
                provide products may lead to removal from the App.
              </P>
              <P>
                <strong>2.7 Your Responsibilities.</strong> You are responsible
                for:
              </P>
              <UL>
                <LI>Ensuring all products listed are available in your store</LI>
                <LI>Maintaining accurate stock levels on the App</LI>
                <LI>
                  Providing products that are fresh, safe, and fit for their
                  intended purpose
                </LI>
                <LI>
                  Complying with all Kenyan laws and regulations regarding the
                  sale of goods
                </LI>
                <LI>Obtaining any necessary licenses or permits for your products</LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part 3: Your Technology Obligations",
          body: (
            <>
              <P>
                <strong>3.1 Download the Seller App.</strong> You must download
                the SoQoni Seller App on at least one (1) smartphone—and
                preferably more—to ensure you never miss an order. The Seller App
                is your gateway to receiving orders, updating prices, and
                managing your store.
              </P>
              <P>
                <strong>3.2 Keep the App Active during Working Hours.</strong>{" "}
                During your stated business hours, the Seller App must remain
                active and logged in to receive order notifications. An inactive
                App means missed orders and unhappy customers.
              </P>
              <P>
                <strong>3.3 Set Correct Working Hours.</strong> You must
                accurately fill in your:
              </P>
              <UL>
                <LI>Store opening time</LI>
                <LI>Store closing time</LI>
                <LI>Working days of the week</LI>
              </UL>
              <P>
                <strong>3.4 Closing the App When Offline.</strong> If you need to
                close your store temporarily—for a holiday, emergency, or any
                other reason—you must update your working hours or mark yourself
                offline in the App. Do not simply leave the App inactive.
                Customers should not be able to order when you cannot fulfill.
              </P>
              <P>
                <strong>3.5 Wrong Contact Information is Your Problem.</strong>{" "}
                You must provide an accurate M-Pesa number to receive payouts. If
                the number you provide is wrong, inactive, or cannot receive
                payments, any delay or loss of funds is entirely your
                responsibility. Double-check your details.
              </P>
              <P>
                <strong>3.6 Product Updates.</strong> You are responsible for
                keeping your product listings current, including prices,
                descriptions, and availability. Outdated listings may lead to
                customer dissatisfaction and removal from the App.
              </P>
            </>
          ),
        },
        {
          heading: "Part 4: How Orders Work",
          body: (
            <>
              <P>
                <strong>4.1 Order Acceptance.</strong> When an order comes in,
                you have 90 seconds to accept or reject it. Quick acceptance
                means happy customers.
              </P>
              <P>
                <strong>4.2 Order Processing.</strong> Once accepted, prepare the
                order quickly. The customer tracks your speed from:
              </P>
              <UL>
                <LI>'Pending' to 'Confirmed' (how fast you accept)</LI>
                <LI>'Confirmed' to 'On the Way' (how fast you pack and hand the order to the rider)</LI>
              </UL>
              <P>
                <strong>4.3 Customer Ratings.</strong> Customers rate you on Speed
                and Product Quality. Higher ratings mean more orders. The
                fastest seller with the best quality will automatically get the
                most orders. Our system prioritizes top-rated stores.
              </P>
              <P>
                <strong>4.4 Low Ratings and Removal.</strong> Consistently low star
                ratings may lead to your removal from the App. Customers expect
                quality products and timely service. We maintain high standards
                to protect our shared reputation.
              </P>
            </>
          ),
        },
        {
          heading: "Part 5: Packaging & Delivery",
          body: (
            <>
              <P>
                <strong>5.1 Packaging.</strong> You provide basic packaging for
                your products. Packaging should be clean, secure, and appropriate
                for the items being delivered.
              </P>
              <P>
                <strong>5.2 SoQoni Bags/Baskets.</strong> We may or may not
                provide branded bags/baskets to your store. This is at our sole
                discretion. If we do provide bags/baskets:
              </P>
              <UL>
                <LI>Use them only for SoQoni deliveries</LI>
                <LI>Keep them clean and in good condition</LI>
                <LI>Report any damage immediately</LI>
                <LI>Riders will return bags/baskets after each delivery</LI>
              </UL>
              <P>
                <strong>5.3 Rider Communication.</strong> Riders will collect
                orders from you. You may coordinate with them briefly for smooth
                pickup.
              </P>
              <P>
                <strong>5.4 Lost Items.</strong> If items are lost during delivery
                and you are clearly shown to have had no negligence, Soal will
                cover the cost. We stand with you when you do your part right.
              </P>
            </>
          ),
        },
        {
          heading: "Part 6: Payments & Fees",
          body: (
            <>
              <P>
                <strong>6.1 No Platform Fees until Further Notice.</strong> Goods
                sellers on the platform will not be charged platform fees until
                further notice. Soal shall provide notice of any future fee
                structure in advance.
              </P>
              <P>
                <strong>6.2 Per Transaction Payouts.</strong> Payments shall be
                made per transaction. Money will be paid once delivery is
                complete and confirmed.
              </P>
              <P>
                <strong>6.3 How You Get Paid.</strong>
              </P>
              <UL>
                <LI>We pay you the full purchase price of all products sold</LI>
                <LI>Payments are made per transaction</LI>
                <LI>Payments complete within a reasonable timeframe</LI>
                <LI>
                  Payments are sent to the M-Pesa number you provide—please
                  ensure it is correct
                </LI>
              </UL>
              <P>
                <strong>6.4 Deductions.</strong> If refunds are issued due to your
                error (damaged or incorrect goods), the amount will be recovered
                from your payouts.
              </P>
            </>
          ),
        },
        {
          heading: "Part 7: Refunds & Returns",
          body: (
            <>
              <P>
                <strong>7.1 Valid Refund Reasons.</strong> Customers may request
                refunds for:
              </P>
              <UL>
                <LI>Damaged or defective products</LI>
                <LI>Wrong items delivered</LI>
                <LI>Items significantly different from description</LI>
              </UL>
              <P>
                <strong>7.2 Your Responsibility.</strong> If a refund is approved
                due to your error:
              </P>
              <UL>
                <LI>You bear the cost of the refunded product</LI>
                <LI>You cover the cost of any replacement delivery</LI>
                <LI>The amount is recovered from your payout</LI>
              </UL>
              <P>
                <strong>7.3 Photo Evidence Required.</strong> Customers must
                provide photo evidence within 2 hours of delivery.
              </P>
              <P>
                <strong>7.4 Company Protection.</strong> Soal will cover costs of
                items lost where you are clearly shown to have had no negligence.
                We protect you when you do your part right.
              </P>
            </>
          ),
        },
        {
          heading: "Part 8: Marketing & Promotions — A Shared Responsibility",
          body: (
            <>
              <P>
                <strong>8.1 We Market You Aggressively.</strong> Soal invests
                heavily in digital and physical marketing campaigns across every
                town we launch. From social media to community events, we work to
                make SoQoni a household name—and your store rides that wave.
              </P>
              <P>
                <strong>8.2 Your Store is Featured.</strong> Your store is listed
                by name in the App's “Categories” (under Markets), “Express”
                (upon search) and the “Stores” section—free, permanent advertising
                seen by every customer in your market. Customers can choose your
                store directly, giving you triple visibility.
              </P>
              <P>
                <strong>8.3 You Must Support Our Marketing Efforts.</strong> As
                our partner, you are expected to actively support SoQoni's
                marketing initiatives. This includes:
              </P>
              <UL>
                <LI>Following Soal's social media platforms actively</LI>
                <LI>
                  Helping distribute advertising bills, posters, and promotional
                  materials through your store
                </LI>
                <LI>
                  Being available for advertising videos, audio recordings, and
                  other promotional content to promote the App
                </LI>
                <LI>Displaying SoQoni promotional materials prominently in your store</LI>
                <LI>
                  Allowing photography and videography of your store and products
                  for our campaigns
                </LI>
                <LI>
                  Participating in marketing exercises such as interviews,
                  testimonials, or featured spotlights when requested
                </LI>
                <LI>
                  Sharing SoQoni content on your personal or business social media
                  pages to amplify our reach
                </LI>
                <LI>
                  Talking positively about SoQoni to your customers and
                  encouraging them to download and use the App
                </LI>
                <LI>
                  Notifying us of any community events where SoQoni could
                  participate or sponsor
                </LI>
              </UL>
              <P>
                <strong>8.4 Professional Photography is Marketing.</strong> Our
                photography team visits to take product and promotional photos.
                These images are not just for listings—they are marketing tools
                that make your store look professional and appealing. Please
                welcome and support them fully.
              </P>
              <P>
                <strong>8.5 Promotions and Offers.</strong> From time to time,
                you may create special offers on the App to attract more
                customers. Our trainers will help you set these up. These
                promotions benefit you directly by driving more sales.
              </P>
              <P>
                <strong>8.6 Featured Store Opportunities.</strong> You may be
                invited to participate in interviews or marketing features that
                showcase your story to thousands of potential customers. When
                asked, we expect your full cooperation—this is free publicity
                for your business.
              </P>
              <P>
                <strong>8.7 Why This Matters.</strong> Marketing is a team
                effort. Our campaigns introduce customers to SoQoni, but your
                support turns them into loyal shoppers at your store. When we win
                together, we grow together.
              </P>
            </>
          ),
        },
        {
          heading: "Part 9: Training & Support",
          body: (
            <>
              <P>
                <strong>9.1 We Train You.</strong> Our trainers will visit to
                help you:
              </P>
              <UL>
                <LI>Upload product prices for the first time</LI>
                <LI>Learn to update prices yourself</LI>
                <LI>Set up promotions and offers</LI>
                <LI>
                  Understand how to manage your App settings, including working
                  hours
                </LI>
              </UL>
              <P>
                <strong>9.2 Ongoing Support.</strong> For any questions or
                issues, contact us anytime:
              </P>
              <P>
                Support: 0748 237 799
                <br />
                Email: applications.sokoni@gmail.com | info@soqoni.co.ke
                <br />
                Website: www.soqoni.co.ke
                <br />
                Social Media: @SoQoni254
              </P>
            </>
          ),
        },
        {
          heading: "Part 10: Your Responsibility to Read and Understand",
          body: (
            <>
              <P>
                <strong>10.1 Read the App Policies.</strong> You are
                responsible for reading and understanding the full SoQoni App
                Terms and Conditions, Privacy Policy, and Refund Policy, which are
                available on the App. These documents contain important
                information about your rights and obligations.
              </P>
              <P>
                <strong>10.2 Stay Informed.</strong> Policies may be updated from
                time to time. You are expected to stay informed of any changes
                through App notifications or other communications from Soal.
              </P>
              <P>
                <strong>10.3 Ask If Unsure.</strong> If you do not understand any
                part of this agreement or the App policies, please ask our team
                before signing. We are here to help.
              </P>
            </>
          ),
        },
        {
          heading: "Part 11: Rules We All Follow",
          body: (
            <>
              <P>
                <strong>11.1 Accurate Information.</strong> You must provide and
                maintain accurate store and contact information.
              </P>
              <P>
                <strong>11.2 Prohibited Items.</strong> No illegal, counterfeit,
                or unsafe products. No items that violate Kenyan law. No items that
                infringe on the rights of third parties, including intellectual
                property rights.
              </P>
              <P>
                <strong>11.3 Fair Dealing.</strong> No fake orders. No
                manipulating ratings. No collusion with other users.
              </P>
              <P>
                <strong>11.4 Product Approval.</strong> Soal reserves the
                exclusive right to approve or disapprove products for sale on the
                App. Some products may not be approved, at our sole discretion and
                without reference to you.
              </P>
              <P>
                <strong>11.5 Removal from App.</strong> We may remove your store
                from the App if you:
              </P>
              <UL>
                <LI>Repeatedly sell low-quality or damaged goods</LI>
                <LI>Consistently overprice items on the App</LI>
                <LI>
                  Fail to keep the Seller App active during working hours, causing
                  missed orders
                </LI>
                <LI>Refuse to cooperate with reasonable marketing requests</LI>
                <LI>Receive consistently low star ratings from customers</LI>
                <LI>Violate these rules after warnings</LI>
              </UL>
            </>
          ),
        },
        {
          heading: "Part 12: Agent Codes and Recruitment",
          body: (
            <>
              <P>
                <strong>12.1 Agent Codes.</strong> Sellers may be assigned Agent
                codes by Soal to become Agents for the additional purpose of
                recruiting new Customers.
              </P>
              <P>
                <strong>12.2 Terms and Compensation.</strong> The terms,
                conditions, and rates of compensation for recruitment activities
                shall be described upon issuance of the Agent code.
              </P>
              <P>
                <strong>12.3 Revocation.</strong> Soal reserves the right to
                revoke or modify Agent codes and associated compensation rates at
                its sole discretion.
              </P>
              <P>
                <strong>12.4 Recruitment Responsibility.</strong> As a partner,
                irrespective of whether or not you are assigned an Agent Code, you
                are encouraged to help recruit new customers to the App. Your
                support in growing our shared customer base benefits everyone.
              </P>
            </>
          ),
        },
        {
          heading: "Part 13: Ending Our Partnership",
          body: (
            <>
              <P>
                <strong>13.1 Notice Period.</strong> Either party may end this
                agreement by giving at least one (1) full month's written notice
                to the other party.
              </P>
              <P>
                <strong>13.2 Immediate Termination.</strong> Soal may end this
                agreement immediately without notice if you:
              </P>
              <UL>
                <LI>Breach any material term of this agreement</LI>
                <LI>Engage in fraudulent or illegal activity</LI>
                <LI>Are removed from the App under Section 11.5</LI>
              </UL>
              <P>
                <strong>13.3 Survival of Terms.</strong> Any terms that by their
                nature should survive termination will continue to apply.
              </P>
            </>
          ),
        },
        {
          heading: "Part 14: Legal Terms",
          body: (
            <>
              <P>
                <strong>14.1 Independent Business.</strong> You remain an
                independent business. This agreement does not create a
                partnership, employment, or agency relationship beyond what is
                written here.
              </P>
              <P>
                <strong>14.2 Our Liability.</strong> Sokoni Applications Ltd
                (Soal) is not liable for:
              </P>
              <UL>
                <LI>The quality or safety of your products</LI>
                <LI>Disputes between you and customers (though we help resolve them)</LI>
                <LI>Delays beyond our reasonable control</LI>
                <LI>Payments sent to a wrong M-Pesa number that you provided</LI>
              </UL>
              <P>
                <strong>14.3 Governing Law.</strong> This agreement is governed by
                the laws of the Republic of Kenya.
              </P>
              <P>
                <strong>14.4 Disputes.</strong> We will first try to resolve any
                disputes amicably. If that fails, the matter will be handled by the
                Kenyan courts.
              </P>
              <P>
                <strong>14.5 Entire Agreement.</strong> This agreement, together
                with the SoQoni App Terms and Conditions, Privacy Policy, and
                Refund Policy (available on the App), constitutes the entire
                agreement between us. By signing below, you confirm that you have
                read and understood these documents.
              </P>
            </>
          ),
        },
        {
          heading: "Part 15: Agreement & Signatures",
          body: (
            <>
              <P>
                By signing below, you confirm that you have read, understood, and
                agree to all the terms in this Goods Seller Contract. You also
                confirm that you will read and comply with the full terms and
                policies available on the SoQoni App.
              </P>
              <P>
                You further confirm that you will download this contract from the
                SoQoni website, sign it, and send the signed copy to
                info@soqoni.co.ke and copy applications.sokoni@gmail.com before
                the relationship with Soal is finalized.
              </P>
              <P>
                <strong>FOR THE SELLER:</strong>
                <br />
                I confirm that I have read and understood this agreement and agree
                to its terms. I also agree to read the full terms and policies
                available on the SoQoni App.
              </P>
              <P>
                Store Name: ___________________________
                <br />
                <br />
                <strong>Markets (please tick all that apply):</strong>
                <br />
                Town - Kitengela
              </P>
              <UL>
                <LI>☐ CBD</LI>
                <LI>☐ EPZ</LI>
                <LI>☐ Milimani</LI>
                <LI>☐ Yukos</LI>
                <LI>☐ Acacia</LI>
                <LI>☐ Korompoi</LI>
              </UL>
              <P>
                Brief Description of Goods Being Sold:
                <br />
                _________________________________________________________
              </P>
              <P>
                M-Pesa Number for Payouts: ___________________________
                <br />
                (I understand that if this number is wrong, it is my
                responsibility.)
              </P>
              <P>
                Signature: ___________________________
                <br />
                Name: ___________________________
                <br />
                Title/Owner: ___________________________
                <br />
                Date: ___________________________
              </P>
              <P>
                <strong>Please return the signed copy to:</strong>
                <br />
                Email: info@soqoni.co.ke | CC: applications.sokoni@gmail.com
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
