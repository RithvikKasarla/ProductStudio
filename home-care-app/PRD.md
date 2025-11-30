PRODUCT REQUIREMENTS DOCUMENT
Home Health Care Marketplace MVP
1. Product Overview
Millions of adult children struggle to secure trusted short-term care for aging parents. Traditional agencies reject more than half of short-term inquiries, require long intake processes, and provide limited transparency during care sessions. Existing online listings are fragmented and unverified.

The product is a two-sided home health marketplace that makes short-term and urgent care support fast, trustworthy, and transparent. It includes:
Nurse/HHA Application (Supply)
End User Application (Demand)
The MVP focuses on high trust, low friction, fast booking for short-term care.
2. Problem Statement
Adult children and older adults need reliable short-term home health aides but face:
High friction to find trusted aides
71 percent rejection of short-term requests
No transparency or visibility during care
Dependence on word of mouth
Slow agency intake and scheduling issues
Caregivers face:
Limited visibility into short-term jobs
Lack of verified profiles that increase trust and demand
Inefficient scheduling and low autonomy
3. User Story for MVP
Primary User Story:
"I am a 40 year old single person. I live with my parents who are elderly and 78 (Mother) and 84 (Father) years old. I am going out of station for an official tour. I will be away for 2 days starting tomorrow. I need a HHA for 2 days to check on them for 3 hours each. The HHA should be reliable and verified. I do not have time to go through an agency and fill out an elaborate form."

Implications for MVP
Must allow booking in under 3 minutes
Must show verified HHAs only
Must show availability for the next day
Must avoid any long intake or manual paperwork
Must highlight trust indicators clearly
4. Target Users
Primary User: Adult children who need short-term help for elderly parents while balancing full-time work or travel. (Pain: trust, friction, delays, transparency failures)
Secondary User: Elderly adults living alone who need temporary recovery support after surgery or illness.
Supply Users: HHAs (PRIMARY TARGET), CNAs, LPNs, RNs looking for flexible short-term assignments with verified families.
5. MVP Goals
Goal 1: Make short-term care booking fast and easy
Goal 2: Deliver reliable matches using verified profiles
Goal 3: Ensure transparency and safety during care sessions
Goal 4: Build foundation for a trust-first marketplace
6. Core User Journey (Happy Path)
End User will execute the following steps:
Open app and register
Tap "Find Short Term Support"
Enter basic requirements in under 2 minutes
View 3 to 5 matched caregivers
Select a caregiver and schedule
Pay and confirm
Receive real-time visit updates

Nurse/HHA will perform the following steps:
Register account
Verify identity, license, and background
Complete profile
Set availability with travel buffer
Get matched and accept jobs
7. Functional Requirements (MVP)
Below is the list of requirements grouped by application.
7.1 End User Application Requirements
A. Quick Sign Up
Phone or email login
OTP verification
Minimalistic onboarding (Name, phone, ZIP code)
B. Ultra Short Intake Flow (Under 2 Minutes)
Required fields:
Who needs care (self or parent)
Age and mobility level
Care required for how many days and how many hours
Tasks needed (checkbox)
Time slot for each day
Address or ZIP code
System tasks:
Save progress automatically
Run triage to classify care level
Run location radius for matching
C. Caregiver Matching
Inputs: skills, availability, travel radius, verification status
Show 3 to 5 recommended caregivers
Display trust indicators:
Verification badge
Years of experience
Skills match
Languages
Rating placeholder
D. Booking and Payment
Select caregiver value card
Confirm schedule
Accept terms
Checkout and process payment
Confirmation screen
E. Visit Visibility
“Caregiver has arrived”
“Session in progress”
“Session completed”
Note: AI monitoring and trust graph are post-MVP features.
7.2 Nurse/HHA Application Requirements
A. Account Creation
Phone or email sign up
OTP verification
Choose role (RN, LPN, CNA, HHA)
B. Document Capture + Verification
Required uploads:
Government ID
License number and type
Certification photo
Training certificates
SSN (last 4 digits) for background checks
Developer requirements:
File upload module
OCR extraction
API integration:
License verification (Nursys or NY State DB)
Background checks (Checkr)
Verification statuses: Pending, Approved, Rejected
C. Profile Setup
Years of experience
Skills (ADL, dementia, transfers, meals etc.)
Languages
Boroughs served
Hourly rate (optional for MVP)
Self introduction
D. Calendar Availability + Travel Buffer
Weekly recurring availability
Caregiver home address entry
Auto travel time calculation
Auto block adjacent slots to prevent double bookings
E. Accepting Jobs
Alert for new requests
View job details
Accept or decline
8. Non Functional Requirements
Performance
Matching results in under 10 seconds
Onboarding time:
Supply under 7 minutes
Demand under 2 minutes
Security
KYC and license verification required
Background check integration
HIPAA compliant storage (where applicable)
Reliability
99 percent uptime
Fail safe: if license check fails, manual override path
Scalability
Designed for expansion to all five NYC boroughs

9. Success Metrics for MVP
Primary KPIs
Supply onboarding duration under 7 minutes
End user intake completion under 2 minutes
Verification turnaround under 24 hours
First match generated under 10 seconds
First booking conversion rate at least 25 percent
Supply side acceptance rate above 60 percent
Secondary KPIs
Drop off rate under 20 percent (end user)
Verified caregiver to active caregiver ratio above 0.8
Repeat booking rate above 20 percent
