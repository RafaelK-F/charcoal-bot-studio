import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Server, FileCheck } from "lucide-react";
import logoImage from "@/assets/opudoc-logo-new.png";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const DataSecurity = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cards = containerRef.current.querySelectorAll('.spotlight-card');
    
    // Check if mouse is over any card
    let isOverAnyCard = false;
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      const cardLeft = cardRect.left - containerRect.left;
      const cardTop = cardRect.top - containerRect.top;
      const cardRight = cardLeft + cardRect.width;
      const cardBottom = cardTop + cardRect.height;
      
      if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
        isOverAnyCard = true;
      }
    });
    
    // Only apply spotlight effects if mouse is over a card
    if (isOverAnyCard) {
      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        
        const cardLeft = cardRect.left - containerRect.left;
        const cardTop = cardRect.top - containerRect.top;
        
        // Calculate center of card
        const cardCenterX = cardLeft + cardRect.width / 2;
        const cardCenterY = cardTop + cardRect.height / 2;
        
        // Calculate distance from mouse to card center
        const distance = Math.sqrt(Math.pow(x - cardCenterX, 2) + Math.pow(y - cardCenterY, 2));
        const maxDistance = 300; // Increased for smoother transition
        
        if (distance <= maxDistance) {
          // Calculate mouse position relative to the card for the spotlight center
          const cardMouseX = ((x - cardLeft) / cardRect.width) * 100;
          const cardMouseY = ((y - cardTop) / cardRect.height) * 100;
          
          // Smooth easing function for opacity (cubic ease-out)
          const normalizedDistance = distance / maxDistance;
          const opacity = Math.max(0, 1 - Math.pow(normalizedDistance, 1.5));
          
          (card as HTMLElement).style.setProperty('--card-mouse-x', `${Math.max(-20, Math.min(120, cardMouseX))}%`);
          (card as HTMLElement).style.setProperty('--card-mouse-y', `${Math.max(-20, Math.min(120, cardMouseY))}%`);
          (card as HTMLElement).style.setProperty('--card-spotlight-opacity', opacity.toString());
        } else {
          (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
        }
      });
    } else {
      // Mouse is between cards, remove all spotlight effects
      cards.forEach(card => {
        (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
      });
    }
  };

  const handleContainerMouseLeave = () => {
    if (!containerRef.current) return;
    
    // Remove spotlight from all cards when mouse leaves container
    const cards = containerRef.current.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
    });
  };

  const legalSections = [
    {
      title: "Data Controller Information",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Controller Identity</h4>
            <p className="text-muted-foreground">
              Vincent Koeckeis-Fresel<br />
              Thael Studio<br />
              Nauschgasse 4/3/2<br />
              1220 Vienna, Austria<br />
              Email: contact@nebeo.studio<br />
              Phone: Available upon request
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Protection Officer</h4>
            <p className="text-muted-foreground">
              Email: contact@nebeo.studio<br />
              Address: Nauschgasse 4/3/2, 1220 Vienna, Austria
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Scope of Application</h4>
            <p className="text-muted-foreground">
              This privacy policy applies to OpuDoc and all associated domains under Thael Studio, 
              including opudoc.com, opudoc.app, opudoc.dev, opudoc.eu, opudoc.link, opudoc.net, 
              and all related subdomains and social media profiles.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Data Processing Information",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Categories of Personal Data</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Account information (name, email address)</li>
              <li>Usage data (login times, feature usage)</li>
              <li>Document content (as uploaded by you)</li>
              <li>Technical data (IP address, browser information)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Purposes and Legal Basis</h4>
            <ul className="text-muted-foreground space-y-2 ml-4 list-disc">
              <li><strong>Service provision:</strong> Contract performance (Art. 6(1)(b) GDPR)</li>
              <li><strong>Account management:</strong> Contract performance (Art. 6(1)(b) GDPR)</li>
              <li><strong>Security monitoring:</strong> Legitimate interests (Art. 6(1)(f) GDPR)</li>
              <li><strong>Marketing communications:</strong> Consent (Art. 6(1)(a) GDPR)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Retention</h4>
            <p className="text-muted-foreground">
              Account data: Retained until account deletion<br />
              Usage data: 24 months<br />
              Marketing data: Until consent withdrawn<br />
              Legal compliance data: As required by law
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Your Rights Under Austrian Law & GDPR",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Subject Rights</h4>
            <ul className="text-muted-foreground space-y-2 ml-4 list-disc">
              <li><strong>Right of access (Art. 15 GDPR):</strong> Request information about your personal data</li>
              <li><strong>Right to rectification (Art. 16 GDPR):</strong> Correct inaccurate personal data</li>
              <li><strong>Right to erasure (Art. 17 GDPR):</strong> Request deletion of your personal data</li>
              <li><strong>Right to restriction (Art. 18 GDPR):</strong> Limit processing of your data</li>
              <li><strong>Right to data portability (Art. 20 GDPR):</strong> Receive your data in a structured format</li>
              <li><strong>Right to object (Art. 21 GDPR):</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw consent for marketing or other consent-based processing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">How to Exercise Your Rights</h4>
            <p className="text-muted-foreground">
              Contact us at: contact@nebeo.studio<br />
              We will respond within 30 days as required by law.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Right to Lodge a Complaint</h4>
            <p className="text-muted-foreground">
              Austrian Data Protection Authority (Datenschutzbehörde)<br />
              Barichgasse 40-42, 1030 Vienna, Austria<br />
              Website: data-protection-authority.gv.at<br />
              Email: dsb@dsb.gv.at
            </p>
          </div>
        </div>
      )
    },
    {
      title: "International Data Transfers",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Third Country Transfers</h4>
            <p className="text-muted-foreground">
              We may transfer data to third countries only with adequate protection:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>EU Commission adequacy decisions</li>
              <li>Standard contractual clauses (Art. 46 GDPR)</li>
              <li>Approved certification mechanisms</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Current Third Country Processors</h4>
            <p className="text-muted-foreground">
              Cloud infrastructure providers with appropriate safeguards in place.
              Contact us for detailed information about specific transfers.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Technical & Organizational Measures",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Security Measures</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>AES-256 encryption in transit and at rest</li>
              <li>Multi-factor authentication</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and logging</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Processing Agreements</h4>
            <p className="text-muted-foreground">
              All third-party processors have signed data processing agreements 
              compliant with Art. 28 GDPR.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Automated Decision-Making",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Automated Processing</h4>
            <p className="text-muted-foreground">
              We do not engage in automated decision-making that produces legal effects 
              or similarly significantly affects you (Art. 22 GDPR).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Profiling Activities</h4>
            <p className="text-muted-foreground">
              Any profiling is limited to improving user experience and service quality, 
              with no legal consequences for data subjects.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Cookies and Tracking Technologies",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Cookie Policy</h4>
            <p className="text-muted-foreground mb-3">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and maintain security.
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-foreground">Essential Cookies</h5>
                <p className="text-muted-foreground text-sm">
                  Required for basic functionality, security, and authentication. These cannot be disabled.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Analytics Cookies</h5>
                <p className="text-muted-foreground text-sm">
                  Help us understand user behavior and improve our services. Data is anonymized and aggregated.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Preference Cookies</h5>
                <p className="text-muted-foreground text-sm">
                  Remember your settings, language preferences, and customization options.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Cookie Management</h4>
            <p className="text-muted-foreground">
              You can manage cookie preferences through your browser settings or our cookie consent banner. 
              Note that disabling certain cookies may limit functionality.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Third-Party Tracking</h4>
            <p className="text-muted-foreground">
              We may use third-party services for analytics and improvement purposes. These services are bound 
              by their own privacy policies and our data processing agreements.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Data Collection and Usage Details",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Registration and Account Data</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Full name, email address, username</li>
              <li>Profile information (optional): Company, role, bio</li>
              <li>Account preferences and settings</li>
              <li>Subscription and billing information</li>
              <li>Authentication credentials (hashed passwords, API keys)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Content and Document Data</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Document content, titles, and metadata</li>
              <li>Version history and revision logs</li>
              <li>Comments, annotations, and collaborative edits</li>
              <li>File attachments and embedded media</li>
              <li>Workspace and project organization data</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Usage and Behavioral Data</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Login timestamps and session duration</li>
              <li>Feature usage patterns and frequency</li>
              <li>Search queries and navigation paths</li>
              <li>Performance metrics and error logs</li>
              <li>Device and browser information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Communication Data</h4>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Support ticket correspondence</li>
              <li>Marketing communication preferences</li>
              <li>In-app notifications and messages</li>
              <li>Feedback and survey responses</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Third-Party Services and Integrations",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Service Providers</h4>
            <p className="text-muted-foreground mb-3">
              We work with trusted third-party service providers to deliver our services. All providers are contractually bound to protect your data.
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-foreground">Cloud Infrastructure</h5>
                <p className="text-muted-foreground text-sm">
                  Hosting, data storage, and computing services with enterprise-grade security and compliance certifications.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Authentication Services</h5>
                <p className="text-muted-foreground text-sm">
                  Secure identity verification and single sign-on capabilities through established identity providers.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Analytics and Monitoring</h5>
                <p className="text-muted-foreground text-sm">
                  Performance monitoring, error tracking, and usage analytics to improve service quality and reliability.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Payment Processing</h5>
                <p className="text-muted-foreground text-sm">
                  Secure payment processing services compliant with PCI DSS standards for subscription and billing management.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Processing Agreements</h4>
            <p className="text-muted-foreground">
              All third-party processors have signed comprehensive data processing agreements that include:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Purpose limitation and data minimization requirements</li>
              <li>Technical and organizational security measures</li>
              <li>Sub-processor approval and notification procedures</li>
              <li>Data subject rights facilitation</li>
              <li>Incident notification and breach response protocols</li>
              <li>Regular compliance auditing and certification requirements</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Data Retention and Deletion Policies",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Detailed Retention Schedule</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-foreground">Active Account Data</h5>
                <p className="text-muted-foreground text-sm">
                  Profile and account information: Retained for the duration of active account status plus 30 days grace period.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Document Content</h5>
                <p className="text-muted-foreground text-sm">
                  User-generated content: Retained until explicit user deletion or account termination plus 90 days for recovery purposes.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Usage Analytics</h5>
                <p className="text-muted-foreground text-sm">
                  Aggregated usage statistics: 24 months for service improvement analysis.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Security Logs</h5>
                <p className="text-muted-foreground text-sm">
                  Authentication and security events: 12 months for security monitoring and incident investigation.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Financial Records</h5>
                <p className="text-muted-foreground text-sm">
                  Billing and payment information: 7 years as required by Austrian commercial law.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Automated Deletion Procedures</h4>
            <p className="text-muted-foreground">
              We maintain automated systems to ensure timely deletion of personal data according to our retention policies. 
              Users can request immediate deletion of their data at any time, subject to legal retention requirements.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Account Deletion Process</h4>
            <p className="text-muted-foreground">
              When you delete your account, we will:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Immediately disable account access and authentication</li>
              <li>Begin permanent deletion of personal data within 48 hours</li>
              <li>Complete data erasure from all systems within 30 days</li>
              <li>Provide confirmation once deletion is complete</li>
              <li>Retain only anonymized usage statistics for service improvement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Data Breach Response and Security Incidents",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Incident Detection and Response</h4>
            <p className="text-muted-foreground mb-3">
              We maintain comprehensive security monitoring and incident response procedures to quickly identify and address potential data breaches.
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-foreground">Detection Systems</h5>
                <p className="text-muted-foreground text-sm">
                  24/7 automated monitoring, anomaly detection, and real-time security alerts across all systems and infrastructure.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Response Timeline</h5>
                <p className="text-muted-foreground text-sm">
                  Incidents are assessed within 1 hour of detection, with containment measures implemented within 4 hours.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Investigation Protocol</h5>
                <p className="text-muted-foreground text-sm">
                  Forensic analysis to determine scope, cause, and impact, with detailed documentation for regulatory reporting.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Notification Procedures</h4>
            <p className="text-muted-foreground">
              In the event of a data breach affecting personal data:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Regulatory authorities notified within 72 hours as required by GDPR</li>
              <li>Affected individuals notified without undue delay if high risk to rights and freedoms</li>
              <li>Clear communication about the nature of the breach and recommended actions</li>
              <li>Regular updates provided throughout the investigation and remediation process</li>
              <li>Post-incident review and security improvements implemented</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Remediation and Prevention</h4>
            <p className="text-muted-foreground">
              Following any security incident, we conduct thorough reviews to strengthen our security posture 
              and prevent similar occurrences through enhanced monitoring, updated procedures, and additional training.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Children's Privacy Protection",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Age Restrictions</h4>
            <p className="text-muted-foreground">
              OpuDoc is not intended for use by children under the age of 16. We do not knowingly collect 
              personal information from children under 16 years of age.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Parental Rights</h4>
            <p className="text-muted-foreground">
              If we become aware that we have collected personal information from a child under 16, we will:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Immediately delete the information from our systems</li>
              <li>Terminate the associated account</li>
              <li>Notify parents or guardians if contact information is available</li>
              <li>Implement additional verification measures to prevent future occurrences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Educational Use</h4>
            <p className="text-muted-foreground">
              For educational institutions using OpuDoc for students under 16, additional safeguards and 
              parental consent procedures apply. Please contact us for information about educational licenses 
              and compliance requirements.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Marketing Communications and Preferences",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Communication Types</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-foreground">Service Communications</h5>
                <p className="text-muted-foreground text-sm">
                  Essential notifications about your account, security alerts, and service updates. These cannot be disabled for active accounts.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Marketing Communications</h5>
                <p className="text-muted-foreground text-sm">
                  Product updates, feature announcements, and promotional content. Requires explicit opt-in consent.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground">Educational Content</h5>
                <p className="text-muted-foreground text-sm">
                  Best practices, tutorials, and documentation tips. Optional subscription based on user preferences.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Consent Management</h4>
            <p className="text-muted-foreground">
              You can manage your communication preferences at any time through:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Account settings dashboard for granular control</li>
              <li>Unsubscribe links in all marketing emails</li>
              <li>Direct contact with our support team</li>
              <li>Preference center for detailed subscription management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Used for Marketing</h4>
            <p className="text-muted-foreground">
              Marketing communications may be personalized based on:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Account type and subscription level</li>
              <li>Feature usage patterns and preferences</li>
              <li>Geographical location (country level)</li>
              <li>Communication engagement history</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Privacy Policy Changes and Updates",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Change Notification Process</h4>
            <p className="text-muted-foreground">
              We may update this privacy policy periodically to reflect changes in our practices, technology, 
              legal requirements, or other factors. We will notify you of material changes through:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Email notification to your registered address</li>
              <li>In-app notifications when you next log in</li>
              <li>Prominent notice on our website</li>
              <li>Updated effective date at the top of this policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Material Changes</h4>
            <p className="text-muted-foreground">
              Material changes include modifications to:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Data processing purposes or legal basis</li>
              <li>Categories of personal data collected</li>
              <li>Third-party data sharing practices</li>
              <li>Data retention periods</li>
              <li>International data transfer procedures</li>
              <li>User rights and how to exercise them</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Your Options Following Changes</h4>
            <p className="text-muted-foreground">
              Following material changes to this policy, you may:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 list-disc mt-2">
              <li>Continue using our services under the updated terms</li>
              <li>Object to new processing activities where legally permitted</li>
              <li>Request account deletion if you disagree with changes</li>
              <li>Contact us with questions or concerns about modifications</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Version History</h4>
            <p className="text-muted-foreground">
              We maintain a comprehensive record of policy changes, including effective dates and summaries 
              of modifications. Previous versions are available upon request for transparency and audit purposes.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground 
          pageId="datasecurity" 
          density="high" 
          style="subtle" 
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <img src={logoImage} alt="OpuDoc Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-foreground">OpuDoc</h1>
            </div>
            <Badge variant="outline" className="glass-level-2 border-primary/30 text-primary">
              Coming Soon
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        ref={containerRef}
        className="spotlight-container relative z-10 container mx-auto px-6 py-16"
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 spring-enter">
            <Badge className="mb-6 glass-level-2 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              <Shield className="w-4 h-4 mr-2" />
              Data Security & Privacy
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your data is
              <br />
              <span className="text-primary">secure with us</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              OpuDoc implements industry-leading security measures to protect your sensitive 
              documentation and ensure complete privacy for your team's knowledge base.
            </p>
          </div>

          {/* Legal Compliance Sections */}
          <div className="space-y-8 mb-16">
            {legalSections.map((section, index) => (
              <Card 
                key={index} 
                className="spotlight-card glass-level-2 p-8 spring-enter-delayed border-border/30"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">{section.title}</h2>
                {section.content}
              </Card>
            ))}
          </div>

          {/* Additional Legal Information */}
          <Card className="spotlight-card glass-level-2 p-8 mb-16 spring-enter-delayed border-border/30">
            <h2 className="text-2xl font-bold text-foreground mb-6">Legal Compliance Framework</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Austrian Law Compliance</h3>
                <ul className="text-muted-foreground space-y-2 ml-4 list-disc">
                  <li>Data Protection Act (DSG) BGBI. I No. 165/1999</li>
                  <li>Austrian Data Protection Authority oversight</li>
                  <li>Telecommunications Act (TKG) provisions</li>
                  <li>Austrian Commercial Code requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">International Standards</h3>
                <ul className="text-muted-foreground space-y-2 ml-4 list-disc">
                  <li>ISO 27001 Information Security Management</li>
                  <li>SOC 2 Type II Certification</li>
                  <li>EU-US Data Privacy Framework participation</li>
                  <li>Regular third-party security audits</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="spotlight-card glass-level-2 p-8 text-center spring-enter-delayed border-border/30">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Protection Contact</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p className="mb-2">For questions about data protection, privacy, or to exercise your rights:</p>
                <p className="text-primary font-medium">contact@nebeo.studio</p>
              </div>
              <div>
                <p className="mb-2">Data Protection Officer:</p>
                <p className="text-primary font-medium">contact@nebeo.studio</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">EU Dispute Resolution</h4>
                <p className="text-muted-foreground">
                  EU Commission's Online Dispute Resolution Platform:<br />
                  <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    https://ec.europa.eu/odr
                  </a>
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-border/30">
                <p className="text-sm">
                  This privacy notice was last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm mt-2">
                  Governed by Austrian law and GDPR. Jurisdiction: Vienna, Austria
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 Thael Studio. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Back to Home</a>
              <a href="https://nebeo.studio" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Imprint</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataSecurity;