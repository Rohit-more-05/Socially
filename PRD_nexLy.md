NexLy Social Platform - Product Requirements Document
Version: 1.0
Date: January 27, 2026
Status: Integration-Ready for YBT Chat
Audience: Development teams (NexLy + YBT Chat integration)

Executive Summary
NexLy is a Next.js-based social platform designed for students, combining Twitter-like social networking with integrated mental health support tools. The platform enables users to create posts, follow peers, engage through likes and comments, and access AI-powered mental wellness features (chat, depression tracking, mood analysis). Built on a modern tech stack (Next.js 14+, Clerk authentication, PostgreSQL via Prisma), NexLy is positioned to integrate with YBT Chat to provide students with professional counselor access. This PRD documents all platform capabilities with explicit focus on integration points for YBT Chat's counselor services.

1. Product Overview
Attribute	Value
Platform Name	NexLy
Type	Social Networking + Mental Health Tools
Primary Users	Students
Problem Solved	Students need a safe, peer-connected space to share thoughts AND access AI/professional mental health support
Core Value Proposition	Social feed + AI assistant + assessment tools + counselor referral
Target Integration	YBT Chat (professional counselors)
Key Problems Addressed
Social isolation among students
Limited access to mental health resources
Lack of peer support networks
Need for professional counselor access on-demand
Core Features
Social Network - Post, comment, like, follow peers
AI Mental Wellness - Gemini-powered conversational AI
Mental Health Assessment - Depression tracker (PHQ-10), mood analyzer
Professional Support - Redirect to YBT Chat for counselor sessions
Notifications - Real-time alerts for follows, likes, comments
2. Technology Stack & Architecture
Layer	Technology	Details
Frontend	Next.js 14+ (App Router)	React 18, TypeScript, TailwindCSS
Backend	Server Actions (no REST API)	Direct Prisma ORM calls from UI
Authentication	Clerk	Email/password + Google OAuth
Database	Neon (PostgreSQL)	Managed via Prisma ORM
File Storage	Uploadthing	Post images, profile images (4MB max)
AI Integration	Google Gemini 2.5 Flash	Mental wellness chatbot
Email Service	Gmail + Nodemailer	Depression assessment reports
UI Components	Radix UI + TailwindCSS	Accessible component library
Hosting Target	Vercel	Next.js native deployment
Architecture Diagram
3. Database Schema (Prisma Models)
Model: User
Purpose: Core identity model; synced from Clerk authentication

Fields:

id (String, CUID, PK) - Primary key
clerkId (String, Unique) - Clerk user identifier
email (String, Unique) - User email from Clerk
username (String, Unique) - Handle for mentions/search; auto-generated from email if not provided
fullName (String, Optional) - User's display name from Clerk
bio (String, Optional) - Profile bio (editable)
location (String, Optional) - User location (editable)
website (String, Optional) - Profile link (editable)
profileImage (String, Optional) - Avatar URL from Uploadthing
createdAt (DateTime, Default: now()) - Account creation timestamp
updatedAt (DateTime, Auto) - Last profile update
Relations:

posts (One-to-Many → Post) - Posts authored by user [CASCADE DELETE]
comments (One-to-Many → Comment) - Comments authored by user [CASCADE DELETE]
likes (One-to-Many → Like) - Posts liked by user [CASCADE DELETE]
followers (One-to-Many → Follows) - Users following this user (reverse relation: "follower")
following (One-to-Many → Follows) - Users this user follows (reverse relation: "following")
notificationsReceived (One-to-Many → Notification) - Notifications sent to this user
notificationsCreated (One-to-Many → Notification) - Notifications triggered by this user
Used By:

Server Actions: syncUser(), getUserByClerkId(), getDbUserId(), searchUsers(), isFollowing(), updateProfile()
Components: Navbar (user profile), PostCard (author info), WhoToFollow (suggestions)
Clerk Integration:

On first user navigation, syncUser() creates User record
clerkId is the authoritative source of truth
Clerk metadata (email, fullName) synced at registration
Model: Post
Purpose: User-generated content; core feed item

Fields:

id (String, CUID, PK)
authorId (String, FK → User) - Post creator [CASCADE DELETE if user deleted]
content (String, Optional) - Post text
image (String, Optional) - Image URL from Uploadthing
createdAt (DateTime, Default: now())
updatedAt (DateTime, Auto)
Relations:

author (User) - Author reference
comments (One-to-Many → Comment)
likes (One-to-Many → Like)
notifications (One-to-Many → Notification)
Indexes: Composite index on (authorId, createdAt) for user feed queries

Used By:

Server Actions: createPost(), deletePost(), getPosts(), toggleLike(), createComment()
Components: PostCard (display), CreatePost (creation)
Moderation:

Content checked against 62-word prohibited list before creation
User sees error with flagged words; post rejected if violations found
Model: Comment
Purpose: Nested replies to posts

Fields:

id (String, CUID, PK)
content (String) - Comment text
authorId (String, FK → User) [CASCADE DELETE]
postId (String, FK → Post) [CASCADE DELETE]
createdAt (DateTime, Default: now())
Relations:

author (User)
post (Post)
notifications (One-to-Many → Notification)
Indexes: Composite (authorId, postId) for comment ownership queries

Used By:

Server Actions: createComment() (moderated)
Components: PostCard (comment section display)
Model: Like
Purpose: Post engagement; one like per user per post

Fields:

id (String, CUID, PK)
postId (String, FK → Post) [CASCADE DELETE]
userId (String, FK → User) [CASCADE DELETE]
createdAt (DateTime, Default: now())
Constraints:

Unique on (postId, userId) - prevents duplicate likes
Relations:

post (Post)
user (User)
Indexes: Composite (userId, postId) for user's liked posts queries

Used By:

Server Actions: toggleLike() (creates or deletes)
Components: PostCard (like button state)
Model: Follows
Purpose: Social graph; directional follow relationships

Fields:

followerId (String, FK → User) - User doing the following [CASCADE DELETE]
followingId (String, FK → User) - User being followed [CASCADE DELETE]
createdAt (DateTime, Default: now())
Primary Key: Composite (followerId, followingId)

Relations:

follower (User, relation: "follower")
following (User, relation: "following")
Constraints: Unique on same fields (PK enforces); self-follow validation in app logic

Indexes: Composite (followerId, followingId) for follower/following list queries

Used By:

Server Actions: toggleFollow(), getUserFollowers(), getUserFollowing()
Components: FollowButton, WhoToFollow, ProfilePageClient
Model: Notification
Purpose: Activity feed for user engagement (follows, likes, comments)

⚠️ Note: Notification system is detailed here for architectural completeness but is NOT integration-critical for YBT Chat. Included for reference only.

Fields:

id (String, CUID, PK)
recipientId (String, FK → User) - Who receives notification [CASCADE DELETE]
creatorId (String, FK → User) - Who triggered notification [CASCADE DELETE]
type (NotificationType Enum) - LIKE | COMMENT | FOLLOW
isRead (Boolean, Default: false) - Read status
postId (String, Optional, FK → Post) - Referenced post [CASCADE DELETE]
commentId (String, Optional, FK → Comment) - Referenced comment [CASCADE DELETE]
createdAt (DateTime, Default: now())
Relations:

recipient (User)
creator (User)
post (Post, optional)
comment (Comment, optional)
Indexes: Composite (recipientId, isRead, createdAt) DESC for notification feed queries with read status filtering

NotificationType Enum:

LIKE - User A liked User B's post
COMMENT - User A commented on User B's post
FOLLOW - User A followed User B
Used By:

Server Actions: Triggered by toggleLike(), createComment(), toggleFollow() (non-own posts only)
Components: Notifications page
Triggered By:

toggleLike() - if liker is not post author
createComment() - if commenter is not post author
toggleFollow() - always (unless self-follow prevented)
4. Authentication (Clerk Integration)
Setup & Providers
Primary: Email/password authentication
Secondary: Google OAuth sign-in
MFA: Optional (Clerk-managed)
Clerk → NexLy User Sync
Flow:

User signs in via Clerk modal (email/password or Google)
Clerk issues JWT token with user metadata
User navigates to NexLy route
Navbar component calls syncUser() server action
syncUser() checks if User record exists in Neon via clerkId
If new user:
Creates User record with clerkId, email, fullName, username (auto-generated from email if missing)
If existing user:
Returns existing User record
Subsequent actions use getDbUserId() to fetch Prisma user ID from Clerk auth
Clerk Metadata Stored:

Email address
Full name
Profile image URL
Google account info (if OAuth)
Neon User Record Stores:

clerkId (immutable reference to Clerk)
email (from Clerk, non-editable in app)
username (user-facing handle, generated from email)
fullName (from Clerk, non-editable in app)
Editable profile fields: bio, location, website, profileImage (from uploads)
Protected Routes & Auth Checks
Always Protected:

POST actions (all server actions require getDbUserId() → throws if not auth'd)
Profile editing (updateProfile() checks Clerk auth)
Image uploads (Uploadthing middleware checks Clerk)
Public but Different Content:

Homepage (/) - shows posts regardless, but CreatePost hidden if not signed in
Profile pages (/profile/[username]) - public view, edit button only if own profile
Search (/search) - public search, follow button disabled if not signed in
Routes Requiring Manual Verification:

Notifications (/notifications) - page loads but getNotifications() fails silently if not auth'd
Clerk Middleware
Active on all routes except static files
Adds auth context to requests
Enables currentUser() function in server actions
5. Route Documentation
Route: / (Homepage Feed)
File: page.tsx
Purpose: Main social feed; primary user destination
Auth: Public; content display changes if signed in

Components Used:

Navbar - Top navigation + user sync trigger
Sidebar - Left navigation panel (desktop)
CreatePost - Post composition (signed-in only)
PostCard (loop) - Each post with author, comments, likes
WhoToFollow - Right sidebar suggestions (signed-in, desktop)
MobileNavbar - Mobile responsive nav
Server Actions:

syncUser() - Triggered in Navbar on page load
getPosts() - Fetch all posts, newest first
getDbUserId() - Get current user's ID for like/comment buttons
toggleLike() - Like/unlike post
createComment() - Add comment
getRandomUsers() - Populate WhoToFollow
toggleFollow() - Follow/unfollow from suggestions
Database Queries:

POST.findMany() with author, comments (with comment authors), likes, like count
User.findMany() for suggestions (excluding current user and already-followed)
Revalidation: Post creation/deletion/likes/comments trigger homepage revalidation

User Flow:

Unsigned user → sees public posts, no compose box
Signed-in user → sees posts, compose box visible
User types content → clicks Post → moderation check → post created → feed refreshes
User clicks ❤️ → Like created + notification (if not own post) → feed refreshes
User clicks Follow button on suggestion → Follow relationship created → notification sent
Route: /chat (AI Mental Wellness Chatbot)
File: page.tsx
Purpose: Real-time conversation with Gemini AI for mental health support
Auth: Public (loads for all, but more useful when logged in for context)

Components Used:

Message display area (timestamps)
Chat input box (bottom fixed)
Loader spinner (while AI responds)
Message history (scrollable)
API Called:

POST /api/chat - Send message, receive AI response
API Endpoint Details:

Route: route.ts
Method: POST
Input: { messages: Array<{role: "user" | "assistant", content: string}> }
AI Model: Google Gemini 2.5 Flash
System Prompt: Empathetic mental health support companion
Safety Settings: Blocks harassment, hate speech, sexual content, dangerous content (MEDIUM+ threshold)
Output: { text: "AI response" }
Temperature: 0.9 (creative responses)
Max Tokens: 2048
Data Persistence: ❌ Conversation history NOT stored in database (stateless, each session independent)

User Flow:

User enters /chat page
Sees welcome message: "Hello! I'm AI, your mental wellness companion..."
Types message in input
POST to /api/chat with message history
AI responds with empathetic support
Response streams to UI
User can continue conversation (same session only)
Refresh/navigate = new conversation (history lost)
Route: /depression (Depression Severity Assessment)
File: page.tsx
Purpose: PHQ-10 based depression screening; generates email report
Auth: Public

Assessment Flow:

Welcome Screen - Intro to PHQ-10, instructions
Contact Form Screen - Collect user name, email, parent/guardian name, email, phone
Question Screen (10 questions) - Present each question sequentially:
Q1: Interested/pleasure in activities
Q2: Feeling down/depressed/hopeless
Q3: Sleep problems
Q4: Tiredness/fatigue
Q5: Appetite/overeating
Q6: Self-worth/feeling like failure
Q7: Concentration/focus problems
Q8: Psychomotor changes (speed of movement/restlessness)
Q9: Thoughts of death or self-harm
Q10: Feeling overwhelmed
Results Screen - Display score, severity, recommendations
Scoring System:

Options per question: "Not at all" (0), "Several days" (1), "More than half the days" (2), "Nearly every day" (3)
Max total score: 30
Severity levels:
0-4: Minimal depression
5-9: Mild depression
10-14: Moderate depression
15-19: Moderately severe depression
20-30: Severe depression
Email Report (Automatic):

Route: route.ts
Sent to: User email + parent/guardian email
Contents: Contact info, score, severity, detailed answer review, recommendations
Service: Gmail + Nodemailer SMTP
Trigger: User completes assessment and chooses to email report
Data Persistence: ❌ Scores NOT stored in database (report only emailed)

Components Used:

welcome-screen.tsx - Intro
contact-form.tsx - Contact collection
question-screen.tsx - Question UI with radio buttons
results-screen.tsx - Score display, email trigger
User Flow:

User enters /depression page
Reads welcome info
Enters contact info (name, email, parent details)
Answers 10 questions (1 per screen, can go back)
Reaches results screen with score and severity
Clicks "Email Report" button
Report sent to user and parent email addresses
Can retake assessment
Route: /mood-tracker (Daily Mood Analysis)
File: page.tsx
Purpose: Track daily mood patterns and emotional state
Auth: Public

Assessment Flow:

Welcome Screen - Intro to mood tracking
Question Screen (9 questions) - User rates their current state:
Q1: Overall mood (Peaceful / Frustrated / Happy / Balanced)
Q2: Energy level (Low / Tense / Positive / Stable)
Q3: Stress handling (Calm / Overwhelmed / Optimistic / Balanced)
Q4: Social interactions (Quiet / Short-tempered / Joyful / Harmonious)
Q5: Thought patterns (Peaceful / Racing / Positive / Centered)
Q6: Sleep quality (Deep / Restless / Good / Normal)
Q7: Productivity (Slow / Distracted / Enjoyed / Accomplished)
Q8: Physical sensations (Relaxed / Tense / Light / Healthy)
Q9: General mood (additional assessment)
Results Screen - Mood breakdown with categories and emoji indicators
Mood Categories:

🧘 Calm - Peaceful, low-stress responses
😡 Anger - Tense, frustrated, overwhelmed responses
😊 Happy - Positive, joyful, optimistic responses
⚖️ Balanced - Stable, centered, harmonious responses
Visualization:

Uses Recharts library for mood distribution chart
Bar chart showing category percentages
Color-coded results
Data Persistence: ❌ Mood data NOT stored in database (one-time assessment only)

Components Used:

mood-welcome-screen.tsx - Intro
mood-question-screen.tsx - Question UI
mood-results-screen-enhanced.tsx - Chart visualization
mood-results-screen.tsx - Text results
User Flow:

User enters /mood-tracker page
Clicks start
Answers 9 questions about current mood/state
Reaches results screen with mood breakdown
Sees chart visualization
Can retake to see mood changes
Route: /counselor (YBT Chat Integration Redirect)
File: src/app/counselor/page.tsx (TO BE CREATED)
Purpose: Bridge to professional counselor support via YBT Chat
Auth: Protected (signed-in users only)

Current Status: ❌ Route does NOT exist; clicking "Contact Counsellor" in ChatBot returns 404

Implementation Required:

Integration Details: See Section 9 (Integration Points for YBT Chat)

User Flow:

User in NexLy clicks "Contact Counsellor" (ChatBot modal, 4th option)
Directed to /counselor page
Page loads, verifies Clerk auth
Fetches user profile (email, username, bio, fullName)
Generates JWT bridge token
Redirects to YBT Chat with token
YBT Chat creates/syncs user in Supabase
User enters counselor chat interface
User can discuss mental health with professional counselor
Route: /profile/[username] (User Profile)
File: src/app/profile/[username]/page.tsx
Purpose: Public user profile with posts, likes, follower info
Auth: Public

Page Components (Server + Client):

Server component fetches data and passes to ProfilePageClient.tsx
ProfilePageClient.tsx handles UI and interactions
Server Data Fetched:

User profile: getProfileByUsername(username) - name, username, bio, image, location, website, createdAt
User stats: Follower count, following count, post count
User posts: getUserPosts(userId) - all posts authored
Liked posts: getUserLikedPosts(userId) - posts user has liked
Followers list: getUserFollowers(userId)
Following list: getUserFollowing(userId)
Is current user following: isFollowing(userId)
Client Interactions:

Tabs: "Posts" | "Likes" - switch between user's posts and liked posts
Edit Profile dialog (own profile only) - editable fields: name, bio, location, website
Follow/Unfollow button (other profiles only)
Followers/Following modal lists (clickable counts)
404 Handling:

If user doesn't exist, uses Next.js notFound() to show 404 page
User Flow:

Click username link from post or search result
Navigate to /profile/[username]
View profile info, posts, follower counts
If own profile: see Edit button
If other profile: see Follow/Unfollow button
Click tabs to switch between Posts and Likes
Click follower/following counts to see lists
Route: /search (User Search)
File: page.tsx
Purpose: Search for users by name or username
Auth: Public

Features:

Debounced search input (300ms delay)
Case-insensitive search on name and username (OR condition)
Max 20 results
Each result shows: avatar, name, username, follower count, Follow button
Follow button disabled if not signed in
Server Action:

searchUsers(query) - Returns up to 20 users matching query
User Flow:

Enter search term
Debounce waits 300ms
Fetch results via server action
Display user cards with Follow buttons
Click username to view profile
Click Follow button to follow user
Route: /notifications (Notification Feed)
File: page.tsx
Purpose: View activity notifications (follows, likes, comments)
Auth: Protected (signed-in users only)

Features:

Displays all notifications sorted by newest first
Unread count badge at top
Three notification types with icons:
❤️ LIKE - "[Creator] liked your post" (red icon)
💬 COMMENT - "[Creator] commented on your post" (blue icon)
👤 FOLLOW - "[Creator] started following you" (green icon)
Click creator name → navigate to their profile
Click post/comment → navigate to post context
Auto-marks as read on page load
Scrollable area for many notifications
Server Actions:

getNotifications() - Fetch all notifications for current user
markNotificationsAsRead(notificationIds) - Mark read on page load
Notification Triggered By:

toggleLike() - Creates LIKE notification (if liker is not post author)
createComment() - Creates COMMENT notification (if commenter is not post author)
toggleFollow() - Creates FOLLOW notification (always)
User Flow:

Navigate to /notifications
Page loads and auto-marks all as read
View notification feed
Click creator name to view their profile
Click notification to view related post/comment
Desktop navbar shows unread count badge
Route: /api/uploadthing (File Upload Configuration)
File: core.ts
Purpose: Uploadthing configuration for post and profile images

File Route: "imageUploader"

Max file size: 4MB per image
Max files: 1 image per upload
Allowed types: Image files only (JPEG, PNG, etc.)
Auth: Requires Clerk authentication
On upload success: Returns file URL from Uploadthing CDN
Used for: Post images, profile images
6. ChatBot Component Analysis
File: ChatBot.tsx
Type: Client component (floating button)
Visibility: Only shows when user is signed in (wrapped in <SignedIn>)

UI Structure
Button State:

Floating button (bottom-right corner, z-50)
Cyan-to-blue gradient background
Phone icon
Hover effect: scale animation
Backdrop blur when modal open
Modal State:

Backdrop with blur effect
Semi-transparent overlay
4 option cards displayed in grid
Close button (X icon)
4 Integration Options
Option 1: AI Assistant
Path: /chat
Icon: Bot icon
Title: "AI Assistant"
Description: "Chat with our empathetic AI"
Gradient: Indigo-500 to Cyan-500
Behavior: Opens chat interface with Gemini AI
Option 2: Depression Tracker
Path: /depression
Icon: Activity icon
Title: "Depression Tracker"
Description: "Quick mental wellness check"
Gradient: Purple-500 to Red-500
Behavior: Starts PHQ-10 assessment with email report
Option 3: Mood Analyser
Path: /mood-tracker
Icon: Smile icon
Title: "Mood Analyser"
Description: "Track daily emotion patterns"
Gradient: Yellow-500 to Green-500
Behavior: Opens mood assessment with results chart
Option 4: Contact Counsellor ⚠️ INTEGRATION POINT
Path: /counselor ✅ (To be fixed from /councellor)
Icon: Phone icon
Title: "Contact Counsellor"
Description: "Professional human support"
Gradient: Teal-500 to Emerald-500
Behavior: Redirects to YBT Chat via bridge token
Hidden On Routes
/chat - ChatBot hidden to avoid recursion
/depression - ChatBot hidden during assessment
/mood-tracker - ChatBot hidden during assessment
7. Mental Health Features (Detailed)
Depression Assessment (PHQ-10)
Assessment Purpose:

Screen for depression severity using proven medical questionnaire (PHQ-10)
Provide immediate feedback on severity level
Email report for user to share with parents/guardians or healthcare providers
10-Question Format:
Each question has 4 response options:

0 = "Not at all"
1 = "Several days"
2 = "More than half the days"
3 = "Nearly every day"
Questions:

Little interest or pleasure in doing things
Feeling down, depressed, or hopeless
Trouble falling or staying asleep, or sleeping too much
Feeling tired or having little energy
Poor appetite or overeating
Feeling bad about yourself — or that you are a failure or have let yourself or your family down
Trouble concentrating on things, such as schoolwork or watching TV
Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?
Thoughts that you would be better off dead or of hurting yourself in some way
Difficulty with daily tasks or overall feeling overwhelmed
Score Interpretation:

0-4: Minimal depression
5-9: Mild depression
10-14: Moderate depression
15-19: Moderately severe depression
20-30: Severe depression
Email Report Includes:

User contact information
Parent/guardian contact information
Depression score (X/30)
Score percentage
Severity level with color coding
Detailed answer review (all 10 questions and responses)
Clinical recommendations
Encouragement to seek professional help if severe
Data Flow:

User enters contact info (self + parent)
User answers 10 questions
App calculates total score
Results page shows score and severity
User clicks "Email Report"
Server action calls /api/depression-report
API generates HTML email
Nodemailer sends via Gmail SMTP to user + parent
Score NOT persisted to database (report only)
Current Gaps:

⚠️ Scores not stored in database
⚠️ No follow-up mechanism (no counselor auto-referral if severe)
✅ Email delivery works (Nodemailer + Gmail)
Mood Tracker (Daily Mood Assessment)
Purpose:

Help users understand daily mood patterns
Identify emotional triggers
Recognize mood variations across different contexts
Assessment Method:

9 questions covering mood, energy, stress, social, thoughts, sleep, productivity, physical state
Multiple-choice responses (Calm / Anger / Happy / Balanced options)
Visual results with emoji indicators and chart
Mood Categories:

Visualization:

Recharts bar chart showing percentage breakdown
Color-coded by mood category
Emoji indicators for visual recognition
Results Include:

Dominant mood (highest percentage)
Secondary moods
Recommendations based on mood profile
Option to retake assessment
Data Flow:

User enters mood tracker
Answers 9 questions with mood-based options
App categorizes responses
Results page displays chart + breakdown
User can retake to compare
Mood data NOT persisted (one-time session)
Current Gaps:

⚠️ Data not stored in database
⚠️ No historical mood tracking (can't see trends over time)
✅ Real-time chart visualization works
AI Chatbot (Gemini Integration)
Purpose:

Provide 24/7 mental health conversational support
Empathetic, non-judgmental responses
Complement human counseling, not replace
AI Model:

Provider: Google Generative AI
Model: Gemini 2.5 Flash (latest, optimized for conversational AI)
Temperature: 0.9 (creative, empathetic responses)
Max tokens: 2048 (long, detailed responses possible)
System Prompt:

Safety Settings (Blocked Content):

Harassment: Blocked (MEDIUM and above severity)
Hate speech: Blocked (MEDIUM and above)
Sexual content: Blocked (MEDIUM and above)
Dangerous/harmful content: Blocked (MEDIUM and above)
Conversation Features:

Real-time message streaming to UI
Timestamps on each message
User messages styled differently from AI responses
Auto-scroll to latest message
Loading indicator while AI processes
Data Persistence: ❌ NO conversation history stored

Each session is independent
Refresh/navigate = new conversation
No user ID tracking
Privacy-first approach (no data retention)
Response Quality:

Multi-turn conversations supported (passes full message history)
Empathetic tone maintained
Appropriate boundary-setting (refers to professionals)
Current Limitations:

⚠️ No conversation history
⚠️ No follow-up after session ends
⚠️ Not a substitute for professional counseling (disclosed to users)
✅ Immediate support availability (24/7)
8. Social Platform Features (Brief Overview)
Post System
Create:

Text content (required)
Optional image (4MB max via Uploadthing)
Content moderation (62 prohibited words)
Real-time feed refresh on creation
Read:

Chronological feed (newest first)
Author info, timestamp, content, image
Like count, comment count displayed
Comments expandable section
Update:

Editable profile fields only (no post editing)
Delete:

Author can delete own post
Cascade deletes associated comments, likes, notifications
Moderation:

Checks content against prohibited words list
User sees error with flagged words before posting
Post rejected if violations found
Follow System
Follow/Unfollow:

Directional relationship (User A follows User B)
Can unfollow anytime
Auto-generates FOLLOW notification (unless self-follow)
Self-follow prevented in app logic
Follower/Following Lists:

Accessible from profile page
Shows avatar, name, username, follower count
Follow button on each user card
Search Integration:

"Who to Follow" suggestions (3 random users not already followed)
Excludes current user
Shows on homepage right sidebar (signed-in, desktop)
Notification System
Types:

LIKE - Someone liked your post
COMMENT - Someone commented on your post
FOLLOW - Someone followed you
Delivery:

Real-time (created immediately on action)
Auto-marked as read on /notifications page load
Unread count badge in desktop navbar
No email notifications (in-app only)
⚠️ Note: Notification system detailed here for completeness; NOT integration-critical for YBT Chat

9. Integration Points for YBT Chat
Current Implementation Status
Component	Status	Details
/counselor route	❌ Missing	Does not exist; 404 error
ChatBot button	✅ Exists	Points to /counselor (misspelled as /councellor)
Bridge token generation	❌ Missing	Needs JWT endpoint
User data mapping	✅ Defined	NexLy User model ready
Clerk sync	✅ Working	User records created on first login
NexLy User Data Available for YBT
The following NexLy User fields will be provided to YBT Chat via JWT bridge token:

Data Mapping: NexLy → YBT Chat (Supabase)
Integration Flow (Detailed)
User Journey:

Endpoint Requirements (To Implement)
1. Token Generation Endpoint
2. Counselor Page
3. YBT Integration Validation
Environment Variables for Integration
Security Considerations
✅ JWT signed with HS256 (HMAC-SHA256)
✅ Token expires in 1 hour
✅ Only authenticated NexLy users can request token
✅ YBT verifies token signature before user creation
✅ User data minimal (email, username, bio, fullName)
⚠️ No sensitive data in token (no passwords, no clerkId initially)
10. Server Actions (Complete Reference)
File: actions/user.action.ts
syncUser()
Purpose: Sync Clerk user to Neon on first login
Auth: Requires Clerk authentication
Logic:
Get Clerk user (email, fullName, username)
Check if User exists in DB (via clerkId)
If new: Create User with auto-generated username (from email if not provided)
If exists: Return existing User
Returns: User object or null on error
Used by: Navbar component (runs on page load)
Revalidates: None
getDbUserId()
Purpose: Get current authenticated user's Neon ID
Auth: Requires Clerk authentication
Logic:
Get Clerk user ID
Fetch User from DB
If missing: Call syncUser() and retry
Return user ID
Returns: string (user ID) or throws error if not authenticated
Used by: All server actions requiring user context
getUserByClerkId(clerkId)
Purpose: Fetch user profile with stats
Includes: Follower count, following count, post count
Returns: User & { _count: { followers, following, posts } }
Used by: Profile page data fetching
getRandomUsers()
Purpose: Get 3 random users for "Who to Follow" suggestions
Filter Logic:
Exclude current user
Exclude users already followed
Select: id, name, username, image, _count.followers
Returns: Array of 3 User objects
toggleFollow(targetUserId)
Purpose: Follow or unfollow a user
Auth: Requires authentication
Logic:
Check if already following
If yes: Delete Follows relationship
If no: Create Follows relationship + FOLLOW notification
Validations: Can't follow self
Returns: { followed: boolean }
Revalidates: Homepage
searchUsers(query)
Purpose: Search users by name or username
Filter: Case-insensitive; excludes current user
Limit: 20 results max
Returns: Array of User objects
File: actions/post.action.ts
createPost(content, image?)
Purpose: Create new post with optional image
Auth: Requires authentication
Validations:
Content required (non-empty)
Content moderation (no prohibited words)
Image size ≤ 4MB
Moderation: Calls moderateContent(), rejects if violations
Returns: { success: true, post: Post } or { success: false, prohibitedWords: string[] }
Revalidates: Homepage
deletePost(postId)
Purpose: Delete post by ID
Auth: Requires authentication
Validations: Only post author can delete
Cascade: Deletes associated comments, likes, notifications
Returns: { success: true } or error
Revalidates: Homepage
getPosts()
Purpose: Fetch all posts for homepage feed
Includes:
Author: id, name, image, username
Comments with comment authors
Likes (user IDs only)
Counts: likes, comments
Order: Newest first (descending createdAt)
Error handling: Returns empty array if DB error
Returns: Array of Post objects with relations
toggleLike(postId)
Purpose: Like or unlike a post
Auth: Requires authentication
Logic:
Check if already liked
If yes: Delete Like
If no: Create Like + LIKE notification (if not own post)
Validations: Post exists
Returns: { liked: boolean }
Revalidates: Homepage
createComment(postId, content)
Purpose: Add comment to post
Auth: Requires authentication
Validations:
Content required
Content moderation
Moderation: Rejects if prohibited words found
Triggers: COMMENT notification (if not own post)
Returns: { success: true, comment: Comment } or { success: false, prohibitedWords: string[] }
Revalidates: Homepage
File: actions/profile.action.ts
getProfileByUsername(username)
Purpose: Fetch user profile by username
Select: id, name, username, bio, image, location, website, createdAt, _count
Returns: User object or null (used in 404 checking)
getUserPosts(userId)
Purpose: Fetch all posts by a specific user
Includes: Full post data with author, comments, likes
Order: Newest first
Returns: Array of Post objects
getUserLikedPosts(userId)
Purpose: Fetch posts liked by a user
Filter: Posts where this user has a Like
Returns: Array of Post objects
updateProfile(formData)
Purpose: Update user profile information
Editable fields: name, bio, location, website
Auth: Requires authentication (only own profile)
Prisma Op: Update User by clerkId
Returns: Updated User object or error
Revalidates: Profile page
isFollowing(userId)
Purpose: Check if current user follows another user
Auth: Requires authentication
Returns: boolean
File: actions/follows.action.ts
getUserFollowers(userId)
Purpose: Get list of users following this user
Includes: Full user details with stats
Order: Newest followers first
Returns: Array of User objects
getUserFollowing(userId)
Purpose: Get list of users this user follows
Includes: Full user details with stats
Order: Newest follows first
Returns: Array of User objects
File: actions/notification.action.ts
getNotifications()
Purpose: Fetch all notifications for current user
Auth: Requires authentication
Includes:
Creator: id, name, image, username
Post: id, content, image
Comment: id, content, createdAt
Order: Newest first
Returns: Array of Notification objects
markNotificationsAsRead(notificationIds[])
Purpose: Mark multiple notifications as read
Auth: Requires authentication
Prisma Op: Update isRead = true for notification IDs
Returns: Updated count
hasUnreadNotifications()
Purpose: Check if user has unread notifications
Auth: Requires authentication
Returns: boolean
Used by: Desktop navbar badge indicator
File: actions/moderation.action.ts
moderateContent(content)
Purpose: Check content against prohibited words list
Prohibited Words (62 terms):
Negative: stupid, idiot, dumb, bad, worst, worthless, pathetic, useless, etc.
Bullying: hate, ugly, disgusting, freak, creep, stalker, psycho, etc.
Harmful: shut up, kill yourself, die, death, suicide, self-harm, etc.
Profanity: damn, hell, fuck, shit, bitch, cock, pussy, asshole, etc.
Slurs: retard, gay (as slur)
Validation: Word boundary regex (whole words only, case-insensitive)
Returns: { isClean: boolean, prohibitedWords: string[] }
sanitizeContent(content)
Purpose: Replace prohibited words with asterisks (alternative to rejection)
Returns: Sanitized string
getModerationMessage()
Purpose: Get community guidelines message
Returns: string with policies
11. Type System (TypeScript Interfaces)
Database Types (Prisma Generated)
Component Props Types
Server Action Return Types
12. Environment Variables
13. File Inventory (Complete)
Configuration Files
next.config.mjs - Next.js configuration
tsconfig.json - TypeScript configuration
tailwind.config.ts - Tailwind CSS configuration
postcss.config.mjs - PostCSS configuration (Tailwind)
package.json - Dependencies and scripts
components.json - Component library config (Shadcn/UI)
Middleware
middleware.ts - Clerk authentication middleware
App Directory (Routes)
layout.tsx - Root layout wrapper
page.tsx - Homepage feed
globals.css - Global styles
page.tsx - AI Chat page
page.tsx - Depression assessment
page.tsx - Mood tracking
page.tsx - User search
page.tsx - Notifications feed
src/app/profile/[username]/page.tsx - Profile page
src/app/profile/[username]/not-found.tsx - Profile 404
src/app/profile/[username]/ProfilePageClient.tsx - Profile UI
MISSING: src/app/counselor/page.tsx - Counselor page (to create)
API Routes
route.ts - Gemini AI endpoint
route.ts - Email report endpoint
core.ts - File upload configuration
route.ts - Uploadthing handler
MISSING: src/app/api/counselor/token - Token generation endpoint (to create)
MISSING: src/app/api/counselor/validate-ybt - YBT validation endpoint (to create)
Server Actions
user.action.ts - User sync and profile actions
post.action.ts - Post CRUD actions
follows.action.ts - Follow list fetching
profile.action.ts - Profile data actions
notification.action.ts - Notification actions
src/actions/moderation.action.ts - Content moderation
NEW: src/actions/counselor.action.ts - Counselor token generation (to create)
Components
Layout & Navigation
Navbar.tsx - Navigation bar wrapper
DesktopNavbar.tsx - Desktop nav
MobileNavbar.tsx - Mobile nav
SideBar.tsx - Left sidebar (desktop)
Social Features
PostCard.tsx - Single post display
CreatePost.tsx - Post composer
FollowButton.tsx - Follow/unfollow
WhoToFollow.tsx - Suggestions
Mental Health Features
ChatBot.tsx - Floating chatbot modal ⭐ INTEGRATION POINT
welcome-screen.tsx
contact-form.tsx
question-screen.tsx
results-screen.tsx
mood-welcome-screen.tsx
mood-question-screen.tsx
mood-results-screen.tsx
mood-results-screen-enhanced.tsx
Utilities
DeleteAlertDialog.tsx
ImageUpload.tsx
NotificationSkeleton.tsx
PageLoader.tsx
Loader.tsx
Hero.tsx
theme-provider.tsx
mode-toggle.tsx
UI Library (Shadcn/Radix UI)
ui - 18 reusable UI components
Libraries & Utils
prisma.ts - Prisma client singleton
uploadthing.ts - Uploadthing utilities
utils.ts - General utilities
use-mobile.tsx - Mobile detection hook
useDebounce.ts - Debounce hook
Database
schema.prisma - Database schema definition
prisma - Prisma client auto-generated files
14. Gap Analysis & Implementation Checklist
Critical Integration Gaps
Gap	Status	Impact	Action
/counselor route missing	❌ CRITICAL	404 when clicking "Contact Counselor"	CREATE: src/app/counselor/page.tsx
Token generation endpoint missing	❌ CRITICAL	Can't create JWT for YBT	CREATE: src/app/api/counselor/token
User data mapping undefined	⚠️ HIGH	YBT won't know what NexLy fields to expect	DEFINE: email, username, bio, fullName
YBT API integration untested	⚠️ HIGH	Bridge flow not validated	TEST: YBT verification endpoint
Counselor role in navbar	⚠️ MEDIUM	Orphaned dropdown selector	EXCLUDE: from social features, document separately
Mental Health Feature Gaps (Non-Critical)
Gap	Status	Impact	Notes
Chat history not stored	⚠️	Users lose conversation on refresh	Privacy-first design; acceptable
Depression scores not persisted	⚠️	No historical trend tracking	Email report only; OK for MVP
Mood data not saved	⚠️	No mood trend analysis	One-time session only; OK for MVP
Auto-referral if severe depression	⚠️	No automatic counselor escalation	Could add in future iteration
Profile image upload missing	⚠️	Users can't change profile pictures	Edit dialog only allows text fields
Social Platform Gaps (Non-Critical)
Gap	Status	Impact	Notes
Post editing disabled	⚠️	Users can't fix typos	Current design: delete and repost
Real-time chat (no WebSocket)	⚠️	Chat requires manual refresh	Uses polling; acceptable for MVP
No role-based access control	⚠️	All users have same permissions	All are "students"; no advisor view
Notifications email digest	⚠️	In-app only; no email summaries	OK for student platform
15. Codebase Changes Required
CRITICAL: Before PRD Sign-Off
1. Fix Spelling: "councillor" → "counselor"
Current Issues:

ChatBot.tsx hardcodes path as /councellor (misspelled)
Should be /counselor (standard English spelling for advisor)
Files to Update:

ChatBot.tsx
Change button path from /councellor → /counselor
Change title from "Contact Counsellor" → "Contact Counselor"
Change description: "Professional human support" (keep same)
Database Impact:

Prisma schema uses "counselor" correctly
No schema changes needed; codebase spelling issue only
2. Update Neon SQL Table: fullName → full_name
Current State:

Prisma model uses fullName (camelCase)
Neon SQL table should use full_name (snake_case per SQL conventions)
Action:

 Prisma migration: Update schema.prisma to match Neon naming convention
 Or: Generate Prisma migration from existing Neon schema
Migration SQL:

3. Create /counselor Route
File to Create: src/app/counselor/page.tsx

Implementation Outline:

4. Create Token Generation API
File to Create: src/app/api/counselor/token.ts

Endpoint:

RECOMMENDED: Enhancements (Post-MVP)
Add profile image upload to edit profile dialog
Store mood/depression history in Neon for trend analysis
Implement WebSocket chat instead of polling
Auto-escalate to counselor if depression score > 20
Role-based access control for future advisor accounts
16. Appendix: Integration Strategy Reference
Pre-Launch Checklist
 Spelling fixed: counselor (not councillor)
 Neon schema updated: full_name column name
 /counselor route implemented
 Token generation API created
 YBT Chat integration tested
 JWT signature verification working
 User sync working (NexLy → YBT)
 Redirect flow validated end-to-end
 Error handling for failed redirects
 Security: JWT secrets configured
 Security: HTTPS enforced
 Privacy: User consent documented
 Testing: Integration test scenarios completed
 Documentation: Updated user-facing help docs
Data Security Notes
✅ What's Secure:

JWT tokens signed and time-limited (1 hour)
No passwords transmitted in token
Clerk auth verified before token generation
YBT verifies token before user creation
⚠️ What to Monitor:

JWT secret key protection (rotate regularly)
HTTPS enforcement on both NexLy and YBT
User consent to data sharing (add privacy notice)
Email verification on YBT side
End of PRD Document



Required Code Changes Summary
Based on your specifications, here are the changes needed:

Changes to Make:
ChatBot.tsx - Change path and spelling

Line: /councellor → /counselor
Title: "Councillor" → "Counselor"
schema.prisma - Verify/update field naming

Ensure fullName is correctly mapped to full_name in SQL (or rename in schema)
Create src/app/counselor/page.tsx - New route

Implement server component that generates JWT and redirects to YBT
Create src/app/api/counselor/token.ts - New API endpoint

Token generation logic
Create src/actions/counselor.action.ts - New server actions

Helper functions for counselor integration




Update ChatBot.tsx - Fix counselor spelling and path
Create src/app/counselor/page.tsx - New counselor route
Create src/app/api/counselor/token.ts - JWT token generation API
Create src/actions/counselor.action.ts - Server actions for counselor integration
Update schema.prisma - Verify/fix full_name field naming