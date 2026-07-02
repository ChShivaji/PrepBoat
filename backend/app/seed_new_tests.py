import json
import sqlite3
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.database_models import User, Question, Test, TestQuestion

def seed_new_tests():
    db = SessionLocal()
    try:
        # Find admin user
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            # Fallback to any user if admin not found
            admin = db.query(User).first()
        if not admin:
            print("No users found. Please run seed.py first.")
            return

        admin_id = admin.id
        print(f"Using Admin ID: {admin_id}")

        questions_list = []

        # =========================================================================
        # 1. SPRING BOOT QUESTIONS
        # =========================================================================
        sb_q1 = Question(
            title="Spring Boot Auto-Configuration Internals",
            description="Explain how auto-configuration works in Spring Boot. What annotation triggers it, and how does the framework decide which bean configurations to load from the classpath?",
            difficulty="Medium", topic="Spring Boot", category="Core Subjects", tags="Spring Boot,Framework",
            company_tags="Walmart,JPMorgan",
            solution="Auto-configuration is triggered by the `@EnableAutoConfiguration` annotation (which is included in `@SpringBootApplication`). It uses `SpringFactoriesLoader` to read META-INF/spring.factories (or imports files in newer Spring Boot versions) and loads configurations conditionally using `@ConditionalOnClass`, `@ConditionalOnBean`, `@ConditionalOnMissingBean`, and `@ConditionalOnProperty` annotations based on classpath contents and property states.",
            explanation="Spring Boot scans libraries on the classpath and configures sensible defaults automatically, which can be overridden by user beans."
        )
        sb_q2 = Question(
            title="Spring Boot Dependency Injection & Bean Scopes",
            description="What is Dependency Injection (DI) in Spring Boot, and what are the primary bean scopes available? Explain the difference between Singleton and Prototype scopes.",
            difficulty="Easy", topic="Spring Boot", category="Core Subjects", tags="Spring Boot,DI",
            company_tags="TCS,Infosys",
            solution="Dependency Injection is a design pattern that removes hardcoded dependencies from classes. The primary bean scopes are:\n1. Singleton (default) - Only one instance is created per Spring IoC container.\n2. Prototype - A new instance is created every time the bean is requested.\n3. Request - One instance per HTTP request (web-aware).\n4. Session - One instance per HTTP session (web-aware).",
            explanation="Spring uses IoC container to manage the lifecycle and dependencies of beans."
        )
        sb_q3 = Question(
            title="Spring Boot AOP (Aspect-Oriented Programming)",
            description="What is Spring Boot AOP (Aspect-Oriented Programming)? Define 'Aspect', 'Join Point', 'Advice', and 'Pointcut' with a brief example.",
            difficulty="Medium", topic="Spring Boot", category="Core Subjects", tags="Spring Boot,AOP",
            company_tags="Accenture,Wipro",
            solution="Spring AOP enables modularization of cross-cutting concerns (e.g. logging, transactions, security).\n- Aspect: A module encapsulating cross-cutting concerns.\n- Join Point: A point during execution (e.g. method invocation) where an Aspect can be applied.\n- Pointcut: A predicate that matches Join Points.\n- Advice: Action taken by an aspect at a join point (e.g. `@Before`, `@After`, `@Around`).",
            explanation="AOP helps separate application logic from boilerplate system services."
        )
        sb_q4 = Question(
            title="Spring Boot Security Filter Chain",
            description="Explain how the Spring Security Filter Chain works. How does it intercept requests and enforce authentication/authorization?",
            difficulty="Hard", topic="Spring Boot", category="Core Subjects", tags="Spring Security,Filters",
            company_tags="Cisco,Google",
            solution="Spring Security's web infrastructure is based on standard Servlet Filters. It registers a `DelegatingFilterProxy` which delegates request interception to `FilterChainProxy` (managed as a Spring Bean). This proxy contains a list of `SecurityFilterChain` beans, each containing a sequence of ordered filters (e.g., `UsernamePasswordAuthenticationFilter`, `BasicAuthenticationFilter`, `FilterSecurityInterceptor`) that authenticate credentials and authorize endpoints.",
            explanation="Request goes through multiple filters in order. If any filter fails auth, request is rejected."
        )
        sb_q5 = Question(
            title="Spring Boot Actuator & Monitoring",
            description="What is Spring Boot Actuator? List three default endpoints provided by Actuator and describe their purpose.",
            difficulty="Easy", topic="Spring Boot", category="Core Subjects", tags="Spring Boot,Monitoring",
            company_tags="Cognizant,Deloitte",
            solution="Spring Boot Actuator provides production-ready features to monitor and manage applications. Default endpoints include:\n1. `/health` - Shows application health information.\n2. `/metrics` - Displays performance metrics (JVM memory, thread counts, HTTP requests).\n3. `/env` - Exposes configuration properties and system environments.",
            explanation="Actuator endpoints can be accessed via HTTP or JMX to keep track of live application telemetry."
        )
        questions_list.extend([sb_q1, sb_q2, sb_q3, sb_q4, sb_q5])

        # =========================================================================
        # 2. JAVA OOPS QUESTIONS
        # =========================================================================
        java_q1 = Question(
            title="Java Inheritance & Diamond Problem",
            description="Does Java support multiple inheritance? How does Java handle the diamond problem using interfaces (from Java 8 onwards)?",
            difficulty="Medium", topic="Java OOPS", category="Core Subjects", tags="Java,OOPS,Inheritance",
            company_tags="Oracle,Infosys",
            solution="Java does not support multiple inheritance of classes to prevent ambiguity (diamond problem). However, Java 8 introduced default methods in interfaces, which allows multiple inheritance of behavior. If a class implements two interfaces containing default methods with the exact same signature, the compiler throws a compile-time error. The class must resolve this ambiguity by overriding the method and explicitly specifying which interface's method to use (e.g., `InterfaceA.super.method()`).",
            explanation="Ambiguity in default interface methods is resolved by forcing the subclass to override it."
        )
        java_q2 = Question(
            title="Java Abstract Class vs Interface",
            description="Compare Abstract Classes and Interfaces in Java. When would you use one over the other?",
            difficulty="Easy", topic="Java OOPS", category="Core Subjects", tags="Java,OOPS,Interfaces",
            company_tags="Accenture,Wipro",
            solution="An interface defines a contract (behavior) that classes must implement. An abstract class defines a base identity with shared state and implementation.\n- Use interfaces when unrelated classes need to implement common behavior (e.g. `Runnable`, `Comparable`).\n- Use abstract class when classes are closely related and share common state (non-static, non-final fields) and code.",
            explanation="Interfaces support multiple implementation, whereas abstract classes only support single inheritance."
        )
        java_q3 = Question(
            title="Java Polymorphism: Overloading vs Overriding",
            description="Explain static polymorphism (method overloading) and dynamic polymorphism (method overriding) in Java. How are they resolved at compile-time and runtime?",
            difficulty="Easy", topic="Java OOPS", category="Core Subjects", tags="Java,OOPS,Polymorphism",
            company_tags="TCS,Cognizant",
            solution="Method Overloading (Static/Compile-time): Multiple methods with same name but different signatures in same class. Resolved at compile-time by binding the method name to parameters.\nMethod Overriding (Dynamic/Run-time): Subclass provides specific implementation of a superclass method. Resolved at runtime using dynamic method dispatch based on object type.",
            explanation="Overloading depends on reference type, overriding depends on actual object type."
        )
        java_q4 = Question(
            title="Java Garbage Collection & Memory Management",
            description="Describe Java Virtual Machine (JVM) memory allocation (Heap vs Stack) and explain how Garbage Collection (GC) cleans objects.",
            difficulty="Medium", topic="Java OOPS", category="Core Subjects", tags="Java,JVM,Garbage Collection",
            company_tags="JPMorgan,Walmart",
            solution="Stack memory is used for thread execution and local primitive variables (temporary life). Heap memory is used for object instances (dynamic life).\nGarbage Collection operates on the Heap. It identifies unreferenced objects (using mark-and-sweep or generational GC) and deallocates their memory. The Heap is divided into Young Generation (Eden, Survivor spaces) and Old Generation to optimize GC passes.",
            explanation="Objects with no reference path from GC Roots are reclaimed by the garbage collector."
        )
        java_q5 = Question(
            title="Java Exception Handling Hierarchy",
            description="Explain the Throwable hierarchy in Java. What is the difference between checked exceptions, unchecked exceptions, and errors?",
            difficulty="Medium", topic="Java OOPS", category="Core Subjects", tags="Java,Exceptions",
            company_tags="Microsoft,Google",
            solution="`Throwable` is the root class of all exceptions.\n- Error: Serious problems that applications should not try to catch (e.g., `OutOfMemoryError`).\n- Exception: Subdivided into checked and unchecked:\n  1. Checked Exceptions (e.g. `IOException`): Inspected at compile-time. Must be caught or declared.\n  2. Unchecked Exceptions (subclasses of `RuntimeException` e.g. `NullPointerException`): Resolved at runtime. Compilation doesn't force catch clauses.",
            explanation="Checked exceptions represent external recoverable conditions; unchecked exceptions represent programming bugs."
        )
        questions_list.extend([java_q1, java_q2, java_q3, java_q4, java_q5])

        # =========================================================================
        # 3. C++ OOPS QUESTIONS
        # =========================================================================
        cpp_q1 = Question(
            title="C++ Virtual Functions and VTABLE",
            description="Explain how virtual functions achieve runtime polymorphism in C++. What are VTABLE and VPTR, and how do they work under the hood?",
            difficulty="Hard", topic="C++ OOPS", category="Core Subjects", tags="C++,OOPS,Polymorphism",
            company_tags="Microsoft,Oracle",
            solution="When a class declares a virtual function, the compiler creates a VTABLE (Virtual Table)—a static array of function pointers pointing to the virtual methods. Each object of that class contains a hidden pointer called VPTR (Virtual Pointer) pointing to the VTABLE. During method call on a base pointer, the compiler dereferences the base object's VPTR to locate the matching function pointer in the VTABLE, invoking the overridden method of the actual derived type.",
            explanation="Dynamic dispatch in C++ uses virtual tables to resolve function bindings at runtime."
        )
        cpp_q2 = Question(
            title="C++ Destructors and Virtual Destructors",
            description="Why do we need virtual destructors in C++? What happens if a base class destructor is not declared virtual when deleting a derived class object via a base pointer?",
            difficulty="Medium", topic="C++ OOPS", category="Core Subjects", tags="C++,OOPS,Destructors",
            company_tags="Google,Cisco",
            solution="If a base class pointer points to a derived class object, deleting the base pointer when the base destructor is *not* virtual invokes undefined behavior—typically only executing the base class destructor and skipping the derived class destructor. This causes memory leaks for any dynamic resources allocated in the derived class. Declaring the base destructor virtual ensures both destructors are executed in correct order (derived first, then base).",
            explanation="Virtual destructors ensure clean cleanup of derived members through base class pointers."
        )
        cpp_q3 = Question(
            title="C++ Copy Constructor vs Assignment Operator",
            description="Explain the difference between a Copy Constructor and an Assignment Operator (`operator=`) in C++. When is each invoked?",
            difficulty="Easy", topic="C++ OOPS", category="Core Subjects", tags="C++,OOPS,Copying",
            company_tags="TCS,Wipro",
            solution="- Copy Constructor: Invoked to initialize a new object using an existing object's state (e.g., `MyClass obj2 = obj1;` or passing by value).\n- Assignment Operator: Invoked to assign value of one existing object to another existing object (e.g., `obj2 = obj1;`). It must handle self-assignment and release existing resources before copying.",
            explanation="Constructor initializes memory; assignment updates already initialized memory."
        )
        cpp_q4 = Question(
            title="C++ Diamond Problem & Virtual Inheritance",
            description="What is the Diamond Problem in C++ multiple inheritance? How does virtual inheritance resolve it?",
            difficulty="Medium", topic="C++ OOPS", category="Core Subjects", tags="C++,OOPS,Inheritance",
            company_tags="Walmart,Infosys",
            solution="The Diamond Problem occurs when class D inherits from B and C, which both inherit from base A. Class D ends up containing two duplicate copies of A's members, leading to compiler ambiguity. Declaring B and C to inherit virtually from A (e.g., `class B : virtual public A`) forces the compiler to maintain only a single shared instance of A inside D, resolving compiler reference errors.",
            explanation="Virtual base classes share a single instance of the ancestor class."
        )
        cpp_q5 = Question(
            title="C++ Smart Pointers & RAII",
            description="Explain RAII (Resource Acquisition Is Initialization) in C++. List the three main smart pointer types introduced in C++11 and their ownership behaviors.",
            difficulty="Medium", topic="C++ OOPS", category="Core Subjects", tags="C++,Memory,Smart Pointers",
            company_tags="Microsoft,Intel",
            solution="RAII binds the lifecycle of a resource (memory, files, locks) to the lifecycle of a stack object. Destructor automatically releases resource when object goes out of scope. Smart pointers implement RAII for memory:\n1. `std::unique_ptr` - Exclusive ownership. Cannot be copied, only moved.\n2. `std::shared_ptr` - Shared ownership. Uses reference counting.\n3. `std::weak_ptr` - Non-owning reference. Prevents cyclic references.",
            explanation="Smart pointers eliminate manual delete calls, preventing memory leaks."
        )
        questions_list.extend([cpp_q1, cpp_q2, cpp_q3, cpp_q4, cpp_q5])

        # =========================================================================
        # 4. OPERATING SYSTEMS QUESTIONS
        # =========================================================================
        os_q1 = Question(
            title="CPU Scheduling Algorithms",
            description="Compare First-Come First-Served (FCFS), Shortest Job First (SJF), and Round Robin (RR) CPU scheduling algorithms. Explain the Convoy Effect.",
            difficulty="Easy", topic="Operating Systems", category="Core Subjects", tags="OS,CPU Scheduling",
            company_tags="TCS,Accenture",
            solution="- FCFS: Non-preemptive, tasks scheduled in arrival order.\n- SJF: Schedules job with shortest burst time. Minimizes average waiting time but can cause starvation.\n- RR: Preemptive, gives each process a small time quantum.\nConvoy Effect occurs in FCFS when a long CPU-bound process blocks multiple short I/O-bound processes, degrading system throughput.",
            explanation="Convoy effect causes slow response times for short processes."
        )
        os_q2 = Question(
            title="Deadlock Conditions & Prevention",
            description="What are the four Coffman conditions required for a deadlock to occur? How can deadlocks be prevented by violating these conditions?",
            difficulty="Medium", topic="Operating Systems", category="Core Subjects", tags="OS,Deadlocks",
            company_tags="Microsoft,Google",
            solution="The four conditions are:\n1. Mutual Exclusion - Only one process can hold a resource.\n2. Hold and Wait - Process holds resource while waiting for another.\n3. No Preemption - Resource cannot be forcibly taken.\n4. Circular Wait - Closed loop of processes waiting for each other.\nPrevention requires design protocols that ensure at least one condition is impossible (e.g., request all resources at start to violate Hold & Wait).",
            explanation="Deadlock prevention guarantees deadlock cannot occur by design, but can decrease resource utilization."
        )
        os_q3 = Question(
            title="Paging vs Segmentation",
            description="Compare Paging and Segmentation memory management techniques. Explain internal vs external fragmentation.",
            difficulty="Easy", topic="Operating Systems", category="Core Subjects", tags="OS,Memory",
            company_tags="Cisco,Oracle",
            solution="- Paging: Divides physical memory into fixed-size frames and virtual memory into pages. Eliminates external fragmentation but causes internal fragmentation (wasted space in last page).\n- Segmentation: Divides memory into variable-sized logical segments (code, stack, heap). Eliminates internal fragmentation but causes external fragmentation (scattered free gaps).",
            explanation="Paging uses fixed sizes; segmentation uses variable logical sizes."
        )
        os_q4 = Question(
            title="Process vs Thread",
            description="Explain the differences between a Process and a Thread. Discuss why context switching between threads is faster than processes.",
            difficulty="Easy", topic="Operating Systems", category="Core Subjects", tags="OS,Concurrency",
            company_tags="Amazon,Samsung",
            solution="A Process is an executing instance of a program with independent memory workspace (Text, Data, Heap). A Thread is a lightweight execution unit inside a process sharing the process's heap and memory address space.\nContext switching between threads is faster because they share memory pages, avoiding expensive flushing of Translation Lookaside Buffer (TLB) and page tables.",
            explanation="Processes are isolated; threads share resource states for low-overhead execution."
        )
        os_q5 = Question(
            title="Operating System Semaphores vs Mutexes",
            description="Describe how a binary semaphore can be used to synchronize two processes. How does it differ from a mutex?",
            difficulty="Medium", topic="Operating Systems", category="Core Subjects", tags="OS,Synchronization",
            company_tags="Deloitte,Wipro",
            solution="A binary semaphore is an integer value (0 or 1) accessed via `wait()` and `signal()`. A process locks by waiting (value goes to 0) and releases by signaling (value goes to 1).\nDifferences:\n- Mutex has ownership: Only the thread that locks a mutex can unlock it.\n- Semaphore has no ownership: Any thread/process can signal a semaphore to release it, making it ideal for synchronization events.",
            explanation="Mutex is a lock; semaphore is a signaling mechanism."
        )
        questions_list.extend([os_q1, os_q2, os_q3, os_q4, os_q5])

        # =========================================================================
        # 5. SQL & RDBMS QUESTIONS (INCLUDING SQL CODING RUNNERS!)
        # =========================================================================
        sql_cases1 = [
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT);",
                "insert": [
                    "INSERT INTO Employee VALUES (1, 100);",
                    "INSERT INTO Employee VALUES (2, 200);",
                    "INSERT INTO Employee VALUES (3, 300);"
                ],
                "expected": [{"salary": 200}]
            },
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT);",
                "insert": [
                    "INSERT INTO Employee VALUES (1, 100);"
                ],
                "expected": [{"salary": None}]
            }
        ]
        sql_sols1 = {
            "sql": "SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS salary;"
        }
        sql_starters1 = {
            "sql": "-- Write your SQL query here\nSELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS salary;"
        }
        sql_q1 = Question(
            title="Second Highest Salary",
            description="Write a SQL query to find the second highest salary from the `Employee` table. If there is no second highest salary, return `NULL`.\n\n`Employee` table schema:\n- `id` (INT)\n- `salary` (INT)",
            difficulty="Easy", topic="RDBMS", category="SQL", tags="SQL,Offset",
            company_tags="Amazon,Google,Meta",
            solution=sql_sols1["sql"],
            explanation="Wrap the select limit offset query inside a parent select statement so that if no row is returned, it returns NULL.",
            entrypoint="sql",
            test_cases=json.dumps(sql_cases1),
            solutions_json=json.dumps(sql_sols1),
            starters_json=json.dumps(sql_starters1)
        )

        sql_cases2 = [
            {
                "schema": "CREATE TABLE Department (id INT, name VARCHAR); CREATE TABLE Employee (id INT, name VARCHAR, salary INT, departmentId INT);",
                "insert": [
                    "INSERT INTO Department VALUES (1, 'IT');",
                    "INSERT INTO Department VALUES (2, 'HR');",
                    "INSERT INTO Employee VALUES (1, 'Joe', 70000, 1);",
                    "INSERT INTO Employee VALUES (2, 'Jim', 90000, 1);",
                    "INSERT INTO Employee VALUES (3, 'Henry', 80000, 2);",
                    "INSERT INTO Employee VALUES (4, 'Sam', 60000, 2);"
                ],
                "expected": [
                    {"department": "IT", "employee": "Jim", "salary": 90000},
                    {"department": "HR", "employee": "Henry", "salary": 80000}
                ]
            }
        ]
        sql_sols2 = {
            "sql": "SELECT d.name AS department, e.name AS employee, e.salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nJOIN (\n    SELECT departmentId, MAX(salary) AS max_salary\n    FROM Employee\n    GROUP BY departmentId\n) m ON e.departmentId = m.departmentId AND e.salary = m.max_salary;"
        }
        sql_starters2 = {
            "sql": "-- Write your SQL query here\nSELECT d.name AS department, e.name AS employee, e.salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nJOIN (\n    SELECT departmentId, MAX(salary) AS max_salary\n    FROM Employee\n    GROUP BY departmentId\n) m ON e.departmentId = m.departmentId AND e.salary = m.max_salary;"
        }
        sql_q2 = Question(
            title="Department Highest Salary",
            description="Write an SQL query to find employees who have the highest salary in each of the departments.\n\n`Employee` table:\n- `id` (INT), `name` (VARCHAR), `salary` (INT), `departmentId` (INT)\n\n`Department` table:\n- `id` (INT), `name` (VARCHAR)",
            difficulty="Medium", topic="RDBMS", category="SQL", tags="SQL,Joins,Group By",
            company_tags="Microsoft,Uber",
            solution=sql_sols2["sql"],
            explanation="Join the Employee table with a subquery that aggregates max salaries by department. Then join with the Department table to fetch department names.",
            entrypoint="sql",
            test_cases=json.dumps(sql_cases2),
            solutions_json=json.dumps(sql_sols2),
            starters_json=json.dumps(sql_starters2)
        )

        sql_cases3 = [
            {
                "schema": "CREATE TABLE Customers (id INT, name VARCHAR); CREATE TABLE Orders (id INT, customerId INT);",
                "insert": [
                    "INSERT INTO Customers VALUES (1, 'Joe');",
                    "INSERT INTO Customers VALUES (2, 'Henry');",
                    "INSERT INTO Customers VALUES (3, 'Sam');",
                    "INSERT INTO Customers VALUES (4, 'Max');",
                    "INSERT INTO Orders VALUES (1, 3);",
                    "INSERT INTO Orders VALUES (2, 1);"
                ],
                "expected": [
                    {"customers": "Henry"},
                    {"customers": "Max"}
                ]
            }
        ]
        sql_sols3 = {
            "sql": "SELECT name AS customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;"
        }
        sql_starters3 = {
            "sql": "-- Write your SQL query here\nSELECT name AS customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;"
        }
        sql_q3 = Question(
            title="Customers Who Never Order",
            description="Write an SQL query to report all customers who never order anything.\n\n`Customers` table:\n- `id` (INT), `name` (VARCHAR)\n\n`Orders` table:\n- `id` (INT), `customerId` (INT)",
            difficulty="Easy", topic="RDBMS", category="SQL", tags="SQL,Joins",
            company_tags="Apple,Amazon",
            solution=sql_sols3["sql"],
            explanation="Use a LEFT JOIN between Customers and Orders, then filter for rows where Orders.customerId (or Orders.id) is NULL.",
            entrypoint="sql",
            test_cases=json.dumps(sql_cases3),
            solutions_json=json.dumps(sql_sols3),
            starters_json=json.dumps(sql_starters3)
        )

        sql_q4 = Question(
            title="Database ACID Transactions",
            description="Explain the ACID properties of database transactions. What are the anomalies prevented by different transaction isolation levels?",
            difficulty="Medium", topic="RDBMS", category="SQL", tags="RDBMS,Transactions",
            company_tags="Oracle,IBM",
            solution="ACID properties:\n- Atomicity: All operations in transaction succeed, or all fail.\n- Consistency: Database transition from one valid state to another.\n- Isolation: Transactions execute independently without concurrency side effects.\n- Durability: Committed updates are permanently written to non-volatile disk.\n\nAnomalies prevented by isolation levels:\n1. Dirty Read: Transaction reads uncommitted updates from another transaction.\n2. Non-repeatable Read: Re-reading same row returns modified values.\n3. Phantom Read: Re-running query returns new inserted rows matching conditions.",
            explanation="Isolation levels range from Read Uncommitted, Read Committed, Repeatable Read, to Serializable."
        )
        sql_q5 = Question(
            title="Database Normalization (3NF vs BCNF)",
            description="Explain 3NF (Third Normal Form) and BCNF (Boyce-Codd Normal Form) in relational databases. Why is BCNF considered stronger than 3NF?",
            difficulty="Hard", topic="RDBMS", category="SQL", tags="RDBMS,Normalization",
            company_tags="Oracle,Microsoft",
            solution="A table is in 3NF if it is in 2NF and has no transitive dependencies. Formally, for X -> Y, either X is a superkey, or Y is a prime attribute (part of candidate key).\nBCNF is stronger because it eliminates exceptions for prime attributes. In BCNF, for every functional dependency X -> Y, X *must* be a superkey. Thus, BCNF is strictly stronger than 3NF and resolves redundancies caused by overlapping candidate keys.",
            explanation="BCNF does not allow Y to be a prime attribute if X is not a superkey."
        )
        questions_list.extend([sql_q1, sql_q2, sql_q3, sql_q4, sql_q5])

        # =========================================================================
        # 6. APTITUDE QUESTIONS
        # =========================================================================
        apt_q1 = Question(
            title="Relative Speed & Train Crossing",
            description="Two trains of lengths 120m and 180m are running on parallel tracks in opposite directions at speeds of 50 km/h and 40 km/h respectively. How long will they take to cross each other?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Speed",
            company_tags="TCS,Accenture",
            solution="Total distance to be covered = Sum of train lengths = 120 + 180 = 300 meters.\nRelative speed (running in opposite directions) = Sum of speeds = 50 + 40 = 90 km/h.\nConverting to m/s: 90 * (5/18) = 25 m/s.\nTime taken = Distance / Relative Speed = 300 / 25 = 12 seconds.",
            explanation="When moving in opposite directions, relative speed is the sum of individual speeds."
        )
        apt_q2 = Question(
            title="Permutations - Word Arrangements",
            description="In how many different ways can the letters of the word 'LEADING' be arranged in such a way that the vowels always come together?",
            difficulty="Medium", topic="Aptitude", category="Aptitude", tags="Aptitude,P&C",
            company_tags="Infosys,Wipro",
            solution="The word 'LEADING' has 7 letters: L, E, A, D, I, N, G.\nVowels are E, A, I (3 vowels).\nConsonants are L, D, N, G (4 consonants).\nSince vowels must come together, treat them as a single entity: (EAI).\nTotal entities to arrange = 4 consonants + 1 group = 5 entities.\nWays to arrange 5 entities = 5! = 120.\nWithin the vowel group, 3 vowels can be arranged in 3! = 6 ways.\nTotal Arrangements = 120 * 6 = 720 ways.",
            explanation="Group items that must remain together, arrange the group along with other items, then arrange items within the group."
        )
        apt_q3 = Question(
            title="Probability - Card Selection",
            description="Two cards are drawn together from a pack of 52 cards. What is the probability that one is a spade and the other is a heart?",
            difficulty="Medium", topic="Aptitude", category="Aptitude", tags="Aptitude,Probability",
            company_tags="Capgemini,TCS",
            solution="Total number of ways to draw 2 cards from 52 = C(52, 2) = (52 * 51) / 2 = 1326.\nNumber of spade cards = 13.\nNumber of heart cards = 13.\nNumber of ways to draw 1 spade and 1 heart = C(13, 1) * C(13, 1) = 13 * 13 = 169.\nProbability = 169 / 1326 = 13 / 102.",
            explanation="Use combination formula C(n,r) to find favorable outcomes and divide by total possible outcomes."
        )
        apt_q4 = Question(
            title="Quantitative Ratios - Profit Sharing",
            description="A and B invest in a business in the ratio 3 : 2. If 5% of the total profit goes to charity and A's share is $855, what is the total profit?",
            difficulty="Easy", topic="Aptitude", category="Aptitude", tags="Aptitude,Ratios",
            company_tags="Accenture,Infosys",
            solution="Let the total profit be P. Profit remaining after charity = 0.95P.\nRatio of investment = 3 : 2. A's share = 3/5 of remaining profit.\nSo, (3/5) * 0.95P = 855.\n0.57P = 855.\nP = 855 / 0.57 = $1500.",
            explanation="First calculate the remaining profit share, set up the proportion based on ratios, and solve for total profit."
        )
        apt_q5 = Question(
            title="Logical Reasoning - Coding Decoding",
            description="In a certain code language, if 'COMPUTER' is written as 'RFUVQNPC', how will 'MEDICINE' be written in that code?",
            difficulty="Medium", topic="Aptitude", category="Aptitude", tags="Aptitude,Logical",
            company_tags="Mindtree,TCS",
            solution="The letters of 'COMPUTER' are written as: First and last letter swapped, and middle letters reversed and shifted by +1.\nFor COMPUTER:\nC -> R, R -> C. Remaining reversed: E-T-U-P-M-O, shifted +1: F-U-V-Q-N-P. Thus: 'RFUVQNPC'.\nFor MEDICINE:\nM -> E, E -> M. Remaining reversed: E-D-I-C-I-N, shifted +1: O-J-D-J-E-F. Swapped boundaries are E and M. Combined: EOJDJEFM.",
            explanation="Swap the boundary characters, reverse the middle string, and shift each char by +1."
        )
        questions_list.extend([apt_q1, apt_q2, apt_q3, apt_q4, apt_q5])

        # Write all questions to db
        print(f"Adding {len(questions_list)} new questions to DB...")
        db.add_all(questions_list)
        db.commit()
        for q in questions_list:
            db.refresh(q)

        # =========================================================================
        # 7. SEED TESTS
        # =========================================================================
        tests_to_create = [
            Test(
                title="Spring Boot Core & Advanced Assessment",
                category="Core Subjects",
                duration_minutes=25,
                total_marks=50,
                created_by=admin_id
            ),
            Test(
                title="Java OOPS & Fundamentals Mastery",
                category="Core Subjects",
                duration_minutes=20,
                total_marks=50,
                created_by=admin_id
            ),
            Test(
                title="C++ OOPs and Memory Management Quiz",
                category="Core Subjects",
                duration_minutes=20,
                total_marks=50,
                created_by=admin_id
            ),
            Test(
                title="Operating Systems Core Concepts",
                category="Core Subjects",
                duration_minutes=15,
                total_marks=50,
                created_by=admin_id
            ),
            Test(
                title="Advanced SQL & Relational Databases",
                category="SQL",
                duration_minutes=30,
                total_marks=50,
                created_by=admin_id
            ),
            Test(
                title="Placement Aptitude & Logical Reasoning",
                category="Aptitude",
                duration_minutes=15,
                total_marks=50,
                created_by=admin_id
            )
        ]

        print(f"Adding 6 new Tests to DB...")
        db.add_all(tests_to_create)
        db.commit()
        for t in tests_to_create:
            db.refresh(t)

        # Map questions to tests
        # Each test gets its 5 corresponding questions (weight = 10 pts each, total = 50 pts)
        test_questions_mapping = []
        
        # Test 1: Spring Boot
        for q in questions_list[0:5]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[0].id, question_id=q.id, weight=10))

        # Test 2: Java OOPS
        for q in questions_list[5:10]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[1].id, question_id=q.id, weight=10))

        # Test 3: C++ OOPS
        for q in questions_list[10:15]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[2].id, question_id=q.id, weight=10))

        # Test 4: Operating Systems
        for q in questions_list[15:20]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[3].id, question_id=q.id, weight=10))

        # Test 5: SQL & RDBMS
        for q in questions_list[20:25]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[4].id, question_id=q.id, weight=10))

        # Test 6: Aptitude
        for q in questions_list[25:30]:
            test_questions_mapping.append(TestQuestion(test_id=tests_to_create[5].id, question_id=q.id, weight=10))

        db.add_all(test_questions_mapping)
        db.commit()

        print("Successfully seeded all new tests and question mapping!")

    except Exception as e:
        print(f"Error seeding new tests: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_new_tests()
