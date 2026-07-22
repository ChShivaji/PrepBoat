export const guidesData = [
  {
    slug: 'dsa-patterns-mastery',
    title: 'Top 10 Data Structure & Algorithm Patterns Every Developer Must Master',
    category: 'DSA & Algorithms',
    date: 'July 2026',
    readTime: '12 min read',
    author: 'PrepBoat Editorial Team',
    summary: 'Stop memorizing individual LeetCode problems. Learn the 10 fundamental algorithmic patterns—from Sliding Window to Monotonic Stack—that solve over 80% of technical coding interview questions.',
    tags: ['DSA', 'Algorithms', 'LeetCode', 'Interview Prep'],
    content: `
# Top 10 Data Structure & Algorithm Patterns Every Developer Must Master

When preparing for technical software engineering interviews at companies like Google, Amazon, Microsoft, or Cisco, candidates often fall into the trap of attempting to solve hundreds of random coding problems. 

However, top software engineers approach coding interviews differently: **they master underlying problem-solving patterns.** By recognizing patterns, you can map unseen interview problems to tried-and-tested algorithmic structures.

Below are the 10 essential algorithmic patterns that account for the vast majority of technical interview coding questions.

---

## 1. Two Pointers Pattern
The Two Pointers pattern uses two pointers to iterate through a data structure (typically an array or string) until one or both pointers meet specific conditions.

### When to Use:
- The input array is sorted (or can be sorted).
- You need to find pairs, triplets, or sub-arrays that satisfy a specific condition (e.g., target sum, palindrome validation).
- Reversing elements or partitioning arrays in-place.

### Example Code (Two Sum II - Sorted Array):
\`\`\`cpp
vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}
\`\`\`

---

## 2. Sliding Window Pattern
The Sliding Window pattern is used to perform required operations on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s.

### When to Use:
- The problem input is a linear data structure (Array, String, or List).
- You are asked to find the minimum/maximum contiguous subarray, substring, or desired property.

### Example Code (Max Sum Subarray of Size K):
\`\`\`python
def max_sub_array_of_size_k(k, arr):
    max_sum, window_sum = 0, 0
    window_start = 0
    
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        if window_end >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[window_start]
            window_start += 1
            
    return max_sum
\`\`\`

---

## 3. Fast & Slow Pointers (Floyd's Cycle Detection)
Also known as the Hare & Tortoise algorithm, this technique uses two pointers that move through the sequence at different speeds.

### When to Use:
- Detecting loops in a Linked List or Circular Array.
- Finding the middle element of a Linked List in a single pass.
- Finding the starting point of a cycle.

---

## 4. Merge Intervals Pattern
The Merge Intervals pattern is an efficient technique to deal with overlapping intervals. Given a list of intervals, you sort them by start time and iteratively merge overlapping blocks.

### Key Use Cases:
- Meeting room scheduling (find minimum meeting rooms required).
- Calendar availability conflicts.
- Insert new interval into a set of non-overlapping intervals.

---

## 5. In-place Reversal of a Linked List
Reversing nodes of a linked list without using auxiliary memory space (O(1) space complexity).

---

## 6. Tree Breadth-First Search (BFS) & Depth-First Search (DFS)
Level-order traversal (Queue) vs Path-based exploration (Stack / Recursion).

---

## 7. Two Heaps (Find Median of a Data Stream)
Using a Min-Heap and a Max-Heap together to maintain dynamic median calculation in O(log N) time insertion and O(1) retrieval.

---

## 8. Subsets & Backtracking
Generating all permutations, combinations, or power sets of an array using backtracking decision trees.

---

## 9. Top 'K' Elements (Priority Queue / Heap)
Finding the K largest, K smallest, or K most frequent elements using a Heap data structure in O(N log K) time.

---

## 10. Dynamic Programming (0/1 Knapsack & Unbounded Knapsack)
Breaking complex problems down into overlapping subproblems and caching intermediate results (memoization / tabular DP).

---

## Conclusion
Mastering these 10 patterns will dramatically increase your problem-solving speed in technical interviews. Head over to the **PrepBoat AI Practice Bank** to practice curated questions categorized by each pattern!
`
  },
  {
    slug: 'ats-resume-optimization',
    title: 'How to Build an ATS-Friendly Software Engineering Resume using Google\'s XYZ Formula',
    category: 'Career & Resume Strategy',
    date: 'July 2026',
    readTime: '10 min read',
    author: 'PrepBoat Placement Team',
    summary: 'Learn how Applicant Tracking Systems (ATS) evaluate candidate resumes. Discover the Google XYZ bullet formula and formatting guidelines that get your resume selected by recruiters.',
    tags: ['Resume', 'ATS Compatibility', 'Career Advice', 'Job Applications'],
    content: `
# How to Build an ATS-Friendly Software Engineering Resume using Google's XYZ Formula

Over 90% of Fortune 500 companies and tech recruiters use Applicant Tracking Systems (ATS) such as Greenhouse, Lever, Workday, and Taleo to automatically filter resumes before a human recruiter ever sees them.

If your resume isn't formatted correctly or lacks quantifiable bullet points, it might get filtered out automatically—even if you have great technical skills!

---

## 1. What is an ATS and How Does it Read Your Resume?
An ATS is a database software that parses unstructured text from PDF and Word documents into structured fields (Name, Skills, Education, Work Experience). 

If your resume uses complex multi-column tables, graphic design elements, icons, or non-standard fonts, the ATS parser gets confused, leading to miscategorized or discarded candidate profiles.

---

## 2. Rules for 100% ATS Compatibility
To ensure your resume passes every automated scanner:

1. **Single-Column Clean Layout:** Avoid side-by-side columns or table boxes. Use clean top-to-bottom sections.
2. **Standard Section Headings:** Use universal headings like \`Education\`, \`Technical Skills\`, \`Experience\`, and \`Projects\`. Avoid creative names like *"What I Have Done"*.
3. **Selectable Text PDF:** Never upload scanned image PDFs. Ensure text can be selected and copied.
4. **Standard Web-Safe Fonts:** Use Inter, Roboto, Arial, Helvetica, or Georgia.
5. **No Graphics or Rating Bars:** Avoid skill rating bars (e.g. "Java 80%"). ATS parsers cannot read skill meters.

---

## 3. The Google XYZ Formula for Bullet Points
Google's recruiters recommend writing every work experience and project bullet point using the **XYZ Formula**:

> **"Accomplished [X], as measured by [Y], by doing [Z]"**

### Comparative Examples:

❌ **Weak / Generic Bullet:**
> *"Built an e-commerce backend using Python and FastAPI."*

✅ **Strong Google XYZ Bullet:**
> *"Engineered an asynchronous e-commerce REST API backend using **FastAPI** and **PostgreSQL**, improving query throughput by **35%** and reducing response latency to under **150ms** across **10K+** simulated requests."*

---

❌ **Weak / Generic Bullet:**
> *"Implemented search feature on the website."*

✅ **Strong Google XYZ Bullet:**
> *"Implemented an indexed full-text search engine using **Elasticsearch**, increasing search query speed by **45%** and serving over **5,000** daily active users."*

---

## 4. Key Sections Every Engineering Resume Needs

### A. Technical Skills Matrix
Group skills clearly by category:
- **Languages:** Python, C++, Java, JavaScript (ES6+), SQL
- **Frameworks & Libraries:** React.js, FastAPI, Node.js, Express, Tailwind CSS
- **Databases & Cloud:** PostgreSQL, MongoDB, Redis, Supabase, Docker, AWS, Vercel
- **Developer Tools:** Git, GitHub, Postman, Linux CLI

### B. Projects Section
Every project entry should detail:
1. **Project Title & Live Link / GitHub Link**
2. **Tech Stack used**
3. **2-3 bullet points** utilizing the XYZ formula (highlighting problem solved, architecture, and metric results).

---

## 5. How PrepBoat AI Helps You Build ATS-Compliant Resumes
PrepBoat AI includes an **AI Resume Scanner and Resume Creator** powered by custom LLM prompts tailored for technical roles. It automatically rephrases your draft descriptions into Google's XYZ formula and checks your layout for ATS compliance.
`
  },
  {
    slug: 'company-prep-strategy',
    title: 'Cracking Technical Interviews at Product & Service Companies: Cisco, Accenture, TCS & Walmart',
    category: 'Company Preparation',
    date: 'July 2026',
    readTime: '15 min read',
    author: 'PrepBoat Editorial Team',
    summary: 'A detailed breakdown of campus hiring patterns, online assessment (OA) question types, core CS fundamentals, and interview strategies for major tech employers.',
    tags: ['Company Prep', 'Cisco', 'Accenture', 'TCS', 'Walmart'],
    content: `
# Cracking Technical Interviews at Product & Service Companies: Cisco, Accenture, TCS & Walmart

Preparing for campus placements and off-campus recruitment drives requires a strategic approach tailored to each company's evaluation style.

In this guide, we break down the exam patterns, technical expectations, and interview strategies for four major tech employers: **Cisco, Accenture, TCS, and Walmart.**

---

## 1. Cisco Placement Strategy & Exam Pattern

Cisco evaluates candidates heavily on **Data Structures, Computer Networks (CN), Operating Systems (OS), and System Design basics.**

### Hiring Rounds:
1. **Online Assessment (OA):** 
   - Aptitude & Logical Reasoning (20 mins)
   - CS Fundamentals MCQs (Networking, OS, C/C++ concepts) (30 mins)
   - 2 Coding Questions (Medium Difficulty - Strings, Arrays, Graphs) (45 mins)
2. **Technical Interview 1:** Focuses on Data Structures (Trees, Graphs, DP) and Computer Networking (TCP/IP stack, OSI layers, DNS, Subnetting).
3. **Technical Interview 2 & Managerial:** Low-level design, project deep-dive, and situational problem-solving.

### Key Tip for Cisco:
Make sure you thoroughly revise **Computer Networking concepts** (TCP vs UDP, 3-Way Handshake, HTTP/HTTPS protocols, IP Addressing) along with standard LeetCode Medium questions.

---

## 2. Accenture Placement Strategy & Exam Pattern

Accenture focuses on **Cognitive Ability, Technical MCQs, Pseudocode, and Communication skills.**

### Hiring Rounds:
1. **Cognitive & Technical Assessment (90 mins):**
   - English Ability, Analytical Ability, Quantitative Aptitude
   - Pseudocode Dry Runs (Loops, Recursion, Bitwise operators)
   - Common Applications & Cloud Basics
2. **Coding Assessment (45 mins):** 
   - 2 Questions (Array manipulation, String parsing, Math logic)
3. **Communication Assessment (30 mins):** Automated verbal fluency and listening test.
4. **One-on-One Technical & HR Interview:** Discussion of resume projects, fundamental coding logic, and situational questions.

---

## 3. TCS Placement Strategy (TCS NQT & CodeVita)

TCS conducts recruitment primarily through **TCS NQT (National Qualifier Test)** and **TCS CodeVita**.

### Key Exam Sections:
- **Foundation Section:** Numerical, Verbal, and Reasoning Ability.
- **Advanced Section:** Advanced Quantitative Ability, Advanced Coding (2 Problems).

### CodeVita Focus:
CodeVita tests **Competitive Programming skills**. Topics include Dynamic Programming, Graph Traversal (DFS/BFS), Combinatorics, and Geometry.

---

## 4. Walmart Global Tech Preparation

Walmart focuses strongly on **Data Structures, Algorithms, Object-Oriented Design (OOD), and Database Management (DBMS).**

### Key Focus Areas:
- **DSA:** Arrays, Sliding Window, Trees, Heaps, Dynamic Programming.
- **DBMS & SQL:** Complex JOIN queries, Indexing strategies, Transaction Isolation levels, ACID properties.
- **Object-Oriented Design:** Design patterns (Singleton, Factory, Observer), Class Diagrams.

---

## Summary Checklist for Candidates
- ✅ Practice 2 coding problems daily on the **PrepBoat AI Practice Bank**.
- ✅ Revise Core CS Subjects: DBMS, OS, Networking, and OOPs.
- ✅ Practice dry-running pseudocode on paper.
- ✅ Prepare 2-minute elevator pitches for your top resume projects.
`
  },
  {
    slug: 'sql-dbms-interview-questions',
    title: 'Essential SQL Queries, Indexing Strategies & DBMS Concepts for Technical Interviews',
    category: 'DBMS & SQL',
    date: 'July 2026',
    readTime: '11 min read',
    author: 'PrepBoat Technical Team',
    summary: 'Master the top SQL query patterns, JOIN types, Subqueries, Normalization rules, and Indexing concepts commonly tested in database technical rounds.',
    tags: ['SQL', 'DBMS', 'Databases', 'Queries', 'Backend'],
    content: `
# Essential SQL Queries, Indexing Strategies & DBMS Concepts for Technical Interviews

Database Management Systems (DBMS) and Structured Query Language (SQL) are core components of backend, data engineering, and full-stack software development interviews.

Here is a comprehensive cheatsheet covering SQL query patterns, normalization rules, indexing mechanisms, and ACID properties.

---

## 1. Top SQL Query Patterns

### A. Finding the N-th Highest Salary
One of the most frequently asked SQL interview questions:

\`\`\`sql
-- Approach 1: Using DENSE_RANK() Window Function (Preferred)
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num
    FROM employees
)
SELECT DISTINCT salary 
FROM RankedSalaries 
WHERE rank_num = 2; -- 2nd highest salary
\`\`\`

### B. Finding Duplicate Rows
\`\`\`sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`

### C. Self-Join (Finding Employees Earning More Than Their Managers)
\`\`\`sql
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
\`\`\`

---

## 2. Understanding SQL JOIN Types
- **INNER JOIN:** Returns records with matching values in both tables.
- **LEFT (OUTER) JOIN:** Returns all records from the left table, and matched records from the right table.
- **RIGHT (OUTER) JOIN:** Returns all records from the right table, and matched records from the left table.
- **FULL (OUTER) JOIN:** Returns all records when there is a match in either left or right table.

---

## 3. Database Normalization (1NF to BCNF)
Normalization reduces data redundancy and improves data integrity:

- **1NF (First Normal Form):** Atomic values; no repeating groups or lists in a single column.
- **2NF (Second Normal Form):** Must be in 1NF and no partial dependencies (non-key attributes depend on the entire primary key).
- **3NF (Third Normal Form):** Must be in 2NF and no transitive dependencies (non-key attributes depend ONLY on candidate keys).
- **BCNF (Boyce-Codd Normal Form):** A stricter version of 3NF where for every functional dependency X → Y, X must be a super key.

---

## 4. ACID Properties in Transactions
- **Atomicity:** All operations in a transaction succeed, or none do ("All or Nothing").
- **Consistency:** Transactions preserve database constraints and valid states.
- **Isolation:** Concurrent transactions execute without interfering with each other.
- **Durability:** Once a transaction commits, data persists even in the event of a system failure.

---

## 5. Indexing & B-Trees
Indexes speed up data retrieval queries (SELECT) at the cost of slower write operations (INSERT, UPDATE). Most relational databases use **B+ Trees** for indexing columns.

### When to Index:
- Columns frequently used in \`WHERE\` clauses, \`JOIN\` conditions, or \`ORDER BY\` clauses.
- High-cardinality columns (columns with many unique values like \`user_id\` or \`email\`).

---

## Conclusion
Reviewing these core concepts along with practical SQL exercises will prepare you to handle any database round with confidence!
`
  }
];
