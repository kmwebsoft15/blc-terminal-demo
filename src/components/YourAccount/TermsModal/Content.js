import React from 'react';
import styled from 'styled-components/macro';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Wrapper = styled.section`
    background-color: ${props => props.theme.palette.backgroundHighContrast};
    color: ${props => props.theme.palette.clrtext};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 12px;
    width: 870px;
    height: 530px;
    overflow-y: inherit;
    padding: 20px 7px 20px 20px;
`;

const InnerWraper = styled.div`
    padding-right: 13px;
`;

const Header = styled.h2`
    font-size: 18px;
    font-weight: bold;
    margin: 0;
`;

const Text = styled.p`
`;

const Link = styled.a`
    color: #0680ba;
    text-decoration: none;
    &:visited, &:link, &:active {
        color: #0680ba;
        text-decoration: none;
    }
`;
/*
    this is ugly formatted, just copied from html/css version source
    I am leaving it as it is since this can be changed later on in the future
    I am suggesting at least removing nbsps and converting this to proper lists, for more semantics
*/

const Content = props => (
    <Wrapper>
        <PerfectScrollbar options={{ maxScrollbarLength: 60 }}>
            <InnerWraper>
                <Header>Terms Of Service</Header>

                <Text>[Last revised: 15 Oct 2018]</Text>

                <Text>
                    This agreement is between you and the service operator, WorldBook. By using any services made available
                    through the WorldBook website (
                    <Link
                        href="https://www.WorldBook.io"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://www.WorldBook.io
                    </Link>
                    ), API, or WorldBook
                    affiliates, you agree that you have read, understood and accepted all of the terms and conditions
                    contained in this Terms of Use agreement, as well as our Privacy Policy and Consent Form which have
                    incorporated the GDPR regulation. As this is a legally binding contract, please carefully read
                    through this agreement and related notices before using any of our Services. By registering,
                    accessing or using WorldBook, you have agreed to the terms and conditions as laid out in this User
                    Agreement. Should you disagree to this User Agreement, please proceed to initiate the account lock
                    function (for existing users) and stop the usage of WorldBook and any of its services.
                </Text>

                <Text>
                    For more information on WorldBook, you can refer to the company and license information found on the
                    website. If you have questions regarding this agreement, please feel free to contact WorldBook for
                    clarification via our Customer Support team.
                </Text>

                <Text>Agreement Conditions </Text>

                <Text>
                    WorldBook reserves the right to modify or change the terms and conditions of the agreement at any time
                    and at its sole discretion. WorldBook will provide notice of these changes by updating the revised Terms
                    of Use on the webpage and changing the “[Last revised: ]” date on this page. Any and all
                    modifications or changes to the Terms of Use will be effective immediately upon being announced on
                    the website or released to users. As such, your continued use of WorldBook’s services acts as acceptance
                    of the amended agreement and rules.
                </Text>

                <Text>Eligibility</Text>

                <Text>
                    By registering to use a WorldBook Account, you have affirmed that you are at least 18 years old and are
                    an individual, legal person or other organization with full legal capacity to enter into this User
                    Agreement between you and WorldBook. If you are not, you and your guardian shall undertake all
                    consequences resulting from your actions and WorldBook shall have the right to cancel or freeze your
                    account in addition to filing claims against you and your guardian for compensation.
                </Text>

                <Text>Prohibition of use</Text>

                <Text>
                    By accessing and using WorldBook and any of its services, you acknowledge and declare that you are not
                    on any trade or economic sanctions lists, such as the United Nations Security Council Sanctions List
                    and its equivalent. WorldBook maintains the right to select its markets and jurisdictions to operate and
                    may restrict or deny its services to certain countries. The content of this Agreement shall not be
                    excluded from the laws of the country under which the user belongs. WorldBook maintains its stance that
                    prohibited users are not to use or access WorldBook and any of its services.
                </Text>

                <Text>Description of services</Text>

                <Text>
                    WorldBook provides an online digital asset trading platform (crypto to crypto) for products commonly
                    known as cryptographic tokens, digital tokens or cryptographic currency. WorldBook does not provide fiat
                    trading capabilities on its platform and as such is not subjected to the stringent regulations that
                    come with it. WorldBook functions as a trading platform provider and is not a buyer or seller in trades
                    made between traders. WorldBook is also not a market maker. Traders must register and open an account with
                    WorldBook and deposit digital assets prior to commencement of trading. Traders may request the withdrawal
                    of their digital assets, subject to the limitations as stated in the Terms and Conditions.
                </Text>

                <Text>
                    WorldBook strives to maintain the accuracy of information posted on its website however it cannot
                    guarantee the accuracy, suitability, reliability, completeness, performance or fitness for purpose
                    of the content through the website, and will not accept liability for any loss or damage that may
                    arise directly or indirectly from the content. Information on WorldBook website can be subjected to change
                    without notice and is provided for the primary purpose of facilitating users to arrive at
                    independent decisions. WorldBook does not provide investment or advisory advice and will have no liability
                    for the use or interpretation of information as stated in its website or other communication
                    mediums. All users of WorldBook must understand that there are risks involved in trading. WorldBook encourages
                    all users to exercise prudence and trade responsibly within their own means.
                </Text>

                <Text>
                    While WorldBook emphasises platform security to ensure the continuity and security of its services
                    (announcements will be made in event of downtime/maintenance), it will be non-accountable to Act of
                    God, malicious targeted hacking, terrorist attacks and other unforeseen circumstances. WorldBook reserves
                    the right to cancel, rollback or block transactions of all type on its platform in event of abnormal
                    transactions. WorldBook will not ask for any password from its users nor ask users to transfer funds that
                    are not listed on its trading platform. Users are encouraged to exercise prudence in dealing with
                    discounts or promotions that could lead to them getting scammed. While the list is non-exhaustive,
                    you agree that WorldBook will not be held responsible for any losses arising from the situations stated
                    above.
                </Text>

                <Text>
                    By using WorldBook and any of its services, you declare that all information to WorldBook in connection with
                    these Terms are true, accurate and complete.
                </Text>

                <Text>WorldBook Account Registration &amp; Requirements</Text>

                <Text>User Identity Verification</Text>

                <Text>
                    With registration of an account on WorldBook, you agree to share personal information requested for the
                    purposes of identity verification. This information is used specifically for the detection of money
                    laundering, terrorist financing, fraud and other financial crimes on the WorldBook platform. In addition
                    to providing this information, to facilitate compliance with global industry standards for data
                    retention, you agree to permit us to keep a record of such information for the lifetime of your
                    account plus 5 years beyond account closing. You also authorise us to make inquiries, either
                    directly or through third parties, that are deemed necessary to verify your identity or to protect
                    you and/or us against financial crimes such as fraud.
                </Text>

                <Text>
                    The Identity Verification information we request may include, but is not limited to, your: Name,
                    Email Address, Contact Information, Telephone Number, Username, Government Issued ID. In providing
                    this required information, you confirm that it is accurate and authentic. Post-registration, you
                    must guarantee that the information is truthful, complete and updated in a timely manner with any
                    changes. If there is any reasonable doubt that any information provided by you is wrong, untruthful,
                    outdated or incomplete, WorldBook shall have the right to send you a notice to demand corrections, remove
                    relevant information directly and, as the case may be, terminate all or part of WorldBook Service to you.
                    You shall be solely and fully responsible for any loss or expenses incurred during the use of WorldBook
                    Service if you cannot be reached through the contact information provided. You hereby acknowledge
                    and agree that you have the obligation to keep all information provided up to date if there are any
                    changes.
                </Text>

                <Text>Account Usage Requirements</Text>

                <Text>
                    WorldBook accounts can only be used by the person whose name they are registered under. WorldBook reserves the
                    right to suspend, freeze or cancel accounts that are used by persons other than the persons whose
                    names they are registered under. Accordingly, WorldBook will not take legal responsibility for these
                    accounts.
                </Text>

                <Text>Account Security</Text>

                <Text>
                    WorldBook prioritizes maintaining the safety of those user funds entrusted to us and has implemented
                    industry standard protections for our platform. With that said, there are account-level risks that
                    are created by individual user actions. We request that you understand the need to independently
                    take safety precautions to protect your own account and personal information.
                </Text>

                <Text>
                    You shall be solely responsible for the safekeeping of your WorldBook account and password on your own,
                    and you shall be responsible for all activities under your log-in email, WorldBook account and password
                    (including but not limited to information disclosure, information posting, consent to or submission
                    of various rules and agreements by clicking on the website, online renewal of agreement,
                    etc.).
                </Text>

                <Text>
                    You hereby agree that: <br/>
                    (a) you will notify WorldBook immediately if you are aware of any unauthorized use of your WorldBook account and
                    password by any person or any other violations to the security rules;<br/>
                    (b) you will strictly observe the security, authentication, dealing, charging, withdrawal mechanism
                    or procedures of the website/service; and <br/>
                    (c) you will log out from the website by taking proper steps at the end of every visit.
                </Text>

                <Text>
                    WorldBook will not be responsible for any loss or consequences caused by your failure to comply with the
                    above Account Security provision.
                </Text>

                <Text>Dispute Resolution</Text>

                <Text>
                    WorldBook reserves the right to resolve issues and disputes at its sole discretion. Some issues include
                    infringement of others’ rights, violation of laws and regulations, abnormal trades and others not
                    explicitly mentioned in the Terms. Users agree to bear the costs arising from the process of dispute
                    resolution.
                </Text>

                <Text>Guidelines for usage of services on WorldBook</Text>

                <Text>
                    You hereby agree to observe the following covenants during your use of services on WorldBook: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● All the activities that you carry out during the use of
                    WorldBook Service will be in compliance with the requirements of applicable laws, regulations, as well as
                    the various guidelines of WorldBook, <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● will not be in violation of public interests, public
                    ethics or other’s legitimate interests, <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● will not constitute evasion of payable taxes or fees and
                    will not violate this agreement or relevant rules. <br/>
                    If you violate the foregoing promises and thereby cause any legal consequence, you shall
                    independently undertake all of the legal liabilities in your own name and indemnify WorldBook from all
                    actions, claims, or costs arising from such violation.
                    You will not use any data or information displayed on the site for commercial purposes without the
                    prior written consent of WorldBook.
                    You will use the site in accordance with the Terms of Use and Privacy Policy, without taking acts of
                    unfair competition nor attempting to intervene with the normal operation of WorldBook. Examples of such
                    malicious acts include, but are not limited to<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● using a device, software or subroutine to interfere with
                    the site<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● overloading network equipments with unreasonable data
                    loading requests<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● executing malicious sales or purchases on the
                    market<br/>
                    By accessing the WorldBook Service, you agree that WorldBook shall have the right to unilaterally determine
                    whether you have violated any of the above covenants and take actions to apply relevant rules
                    without receiving your consent or giving prior notice to you. Examples of such actions include, but
                    are not limited to<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● block and close order requests<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● freezing your account<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● reporting the incident to authorities<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● publishing the alleged violations and actions that have
                    been taken<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● deleting any information you published that is in
                    violation
                </Text>

                <Text>
                    If your alleged violation causes any losses to a third party, you shall solely undertake all the
                    legal liabilities in your own name and hold WorldBook harmless from any loss, fine or extra expenses. If,
                    due to any alleged violation WorldBook incurs any losses, is claimed by any third party for compensation
                    or suffers any punishment imposed by any administrative authorities, you shall indemnify WorldBook against
                    any losses and expense caused thereby, including reasonable attorney’s fee.
                </Text>

                <Text>Service fees</Text>

                <Text>
                    WorldBook reserves the rights to levy service fees on users who use its services. It is in the
                    discretion of WorldBook to adjust the servce fees charged to users using its services.
                </Text>

                <Text>Liability</Text>

                <Text>Provision of Service</Text>

                <Text>
                    WorldBook will provide WorldBook Service at an “as is” and “commercially available” condition, and does not
                    offer any form of warranty with regards to the Service’s reliability, stability, accuracy and
                    completeness of the technology involved. WorldBook serves merely as a venue of transactions where
                    coin-related information can be acquired and coin-related transactions can be conducted. WorldBook cannot
                    control the quality, security or legality of the coin involved in any transaction, truthfulness of
                    the transaction information, or capacity of the parties to any transaction to perform their
                    obligations under the rules. You must carefully consider the associated investment risks, legal
                    status and validity of the transaction information and investment decisions prior to your use of the
                    WorldBook Services provided.
                </Text>

                <Text>Limitation of Liability</Text>

                <Text>
                    You acknowledge and agree, WorldBook shall not be liable for any of your losses caused by any of the
                    following events, including but not limited to:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● Losses of profits, goodwill, usage or data or any other
                    intangible losses<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● Use or failure to use WorldBook Service<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● Unauthorized use of your account or unauthorized
                    alteration of your data by third parties<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● Your misunderstanding of WorldBook Service<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● Any other losses related to WorldBook Service which are not
                    directly attributable to WorldBook<br/>
                </Text>

                <Text>
                    In no event shall WorldBook be liable for any failure or delay of service resulting from regular network
                    maintenance or external factors such as power failure, natural disaster, service provider-side
                    problems or governmental acts.
                </Text>

                <Text>Indemnification</Text>

                <Text>
                    You agree to indemnify and hold harmless WorldBook, its affiliates, contractors, licensors, and their
                    respective directors, officers, employees and agents from and against any claims and damages
                    (including attorneys’ fees, fines or penalties imposed by any regulatory authority) arising out of
                    your breach or our enforcement of this Agreement. This shall also apply to your violation of any
                    applicable law, regulation, or rights of any third party during your use of the WorldBook Service.
                </Text>

                <Text>Termination of Agreement</Text>

                <Text>
                    You agree that we have the right to immediately suspend your account (and any accounts
                    beneficially owned by related entities or affiliates), freeze or lock the funds in all such
                    accounts, and suspend your access to WorldBook if we suspect any such accounts to be in violation of the
                    Terms of Service, Privacy Policy, AML/CTF acts or any applicable laws &amp; regulations. WorldBook shall
                    have the right to keep and use the transaction data or other information related to such accounts.
                    The above account controls may also be applied in the following cases:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● The account is subject to a governmental proceeding,
                    criminal investigation or other pending litigation<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● We detect unusual activity in the account<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● We detect unauthorized access to the account<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● We are required to do so by a court order or command by
                    a regulatory/government authority<br/>
                    In case of any of the following events, WorldBook shall have the right to directly terminate this
                    agreement by cancelling your account, and shall have the right to permanently freeze (cancel) the
                    authorizations of your account on WorldBook and withdraw the corresponding WorldBook account thereof: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● after WorldBook terminates services to you, <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● you allegedly register or register in any other person’s
                    name as WorldBook user again, directly or indirectly; <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● the main content of user’s information that you have
                    provided is untruthful, inaccurate, outdated or incomplete; <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● when this agreement (including the rules) is amended,
                    you expressly state and notify WorldBook of your unwillingness to accept the amended service
                    agreement; <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;● any other circumstances where WorldBook deems it should
                    terminate the services. <br/>
                    Should the account be terminated, the account &amp; transactional information required for meeting
                    data retention standards will be securely stored for five years. In addition, if a transaction is
                    unfinished during the account termination process, WorldBook shall have the right to notify your
                    counterparty of the situation at that time.
                </Text>

                <Text>Remaining funds after account termination (normal)</Text>

                <Text>
                    Once the account is closed/withdrawn, all remaining balance (which includes charges and
                    liabilities owed to WorldBook) on the account will be payable at once to WorldBook. Upon payment of all
                    outstanding charges to WorldBook (if any), the user will have 5 working days to withdraw all funds from
                    the account.
                </Text>

                <Text>Remaining funds after account termination (fraud/AML/violation of terms)</Text>

                <Text>
                    WorldBook maintains full custody of the funds and user data/information which may be turned over to the
                    authorities in event of account suspension/closure arising from fraud investigations, AML
                    investigations or violation of WorldBook’s Terms (eg. trading on WorldBook from a sanctioned country).
                </Text>

                <Text>Compliance with local laws</Text>

                <Text>
                    It is the responsibility of the user to abide by local laws in relation to the legal usage of WorldBook
                    in their local jurisdiction. Users must also factor, to the extent of their local law all aspects of
                    taxation, the withholding, collection, reporting and remittance to their appropriate tax
                    authorities. All users of WorldBook and any of its services acknowledge and declare that the source of
                    their funds come from a legitimate manner and are not derived from illegal activities. WorldBook maintains
                    a stance of cooperation with law enforcement authorities globally and will not hesitate to seize,
                    freeze, terminate the account and funds of users which are flagged out or investigated by legal
                    mandate.
                </Text>

                <Text>Indemnity and disclaimer</Text>

                <Text>
                    You agree to indemnify WorldBook and its entirety of affiliates and hold them harmless from and against
                    all third party claims except from WorldBook’s breach of these Terms. As mentioned in description of
                    services, WorldBook strives its best to maintain the data integrity on its site but does not guarantee the
                    information and services provided in its platform. WorldBook will not be liable for errors arising from
                    the use of its services.
                </Text>

                <Text>Complaints</Text>

                <Text>
                    If you have any complaints, feedback or questions, kindly contact our support team and we will in
                    our best efforts try to resolve it for you.
                </Text>
            </InnerWraper>
        </PerfectScrollbar>
    </Wrapper>
);

export default Content;
