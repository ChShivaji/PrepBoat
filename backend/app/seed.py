import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.database_models import User, Question, Test, TestQuestion, InterviewExperience
import sys

def seed_db():
    db = SessionLocal()
    try:
        # Drop all tables first to apply schema migrations for Postgres columns
        Base.metadata.drop_all(bind=engine)
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # 1. Clean existing records to avoid conflicts
        print("Purging database...")
        db.query(TestQuestion).delete()
        db.query(Test).delete()
        db.query(InterviewExperience).delete()
        db.query(User).delete()
        db.query(Question).delete()
        db.commit()

        # 2. Seed Users
        print("Seeding Users...")
        admin = User(
            name="Admin Administrator",
            email="admin@gmail.com",
            password_hash=hash_password("admin123"),
            college="PrepBoat Academy",
            branch="Computer Science",
            cgpa=9.5,
            target_role="System Architect",
            role="admin"
        )
        
        student = User(
            name="Shivaji Shivaji",
            email="student@gmail.com",
            password_hash=hash_password("student123"),
            college="University of Engineering",
            branch="Information Technology",
            cgpa=8.8,
            target_role="Full Stack Developer",
            role="student"
        )
        db.add(admin)
        db.add(student)
        db.commit()
        db.refresh(admin)
        db.refresh(student)

        # 3. Seed Questions
        print("Seeding Questions (50+ Questions)...")
        questions_list = []

        # =========================================================================
        # DSA QUESTIONS (Easy, Medium, Hard)
        # =========================================================================
        
        # 1. Two Sum
        two_sum_test_cases = [
            {"input": [[2, 7, 11, 15], 9], "output": [0, 1]},
            {"input": [[3, 2, 4], 6], "output": [1, 2]},
            {"input": [[3, 3], 6], "output": [0, 1]}
        ]
        two_sum_solutions = {
            "python": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []",
            "javascript": "function twoSum(nums, target) {\n    const seen = {};\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (diff in seen) {\n            return [seen[diff], i];\n        }\n        seen[nums[i]] = i;\n    }\n    return [];\n}",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (seen.containsKey(diff)) {\n                return new int[] { seen.get(diff), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) {\n                return {seen[diff], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};"
        }
        two_sum_starters = {
            "python": "def twoSum(nums, target):\n    # Write your Python code here\n    pass",
            "javascript": "function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Two Sum",
            description="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            difficulty="Easy", topic="Arrays", category="DSA", tags="Array,Hash Table",
            company_tags="Amazon,Google,Meta",
            solution=two_sum_solutions["python"],
            explanation="Use a Hash Map to store the difference between target and the current number. We scan the array in O(N) time and find the matching index in O(1) lookup time.",
            time_complexity="O(N)", space_complexity="O(N)",
            entrypoint="twoSum",
            test_cases=json.dumps(two_sum_test_cases),
            solutions_json=json.dumps(two_sum_solutions),
            starters_json=json.dumps(two_sum_starters)
        ))

        # 2. Valid Parentheses
        valid_parentheses_test_cases = [
            {"input": "()", "output": True},
            {"input": "()[]{}", "output": True},
            {"input": "(]", "output": False},
            {"input": "([)]", "output": False}
        ]
        valid_parentheses_solutions = {
            "python": "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            "javascript": "function isValid(s) {\n    const stack = [];\n    const mapping = {')': '(', '}': '{', ']': '['};\n    for (let char of s) {\n        if (char in mapping) {\n            const top = stack.pop() || '#';\n            if (mapping[char] !== top) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}",
            "java": "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}",
            "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') {\n                st.push(c);\n            } else {\n                if (st.empty()) return false;\n                char top = st.top();\n                st.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return st.empty();\n    }\n};"
        }
        valid_parentheses_starters = {
            "python": "def isValid(s):\n    # Write your Python code here\n    pass",
            "javascript": "function isValid(s) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public boolean isValid(String s) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Valid Parentheses",
            description="Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by matching brackets in correct order.",
            difficulty="Easy", topic="Stacks", category="DSA", tags="Stack,String",
            company_tags="Meta,Google,Microsoft",
            solution=valid_parentheses_solutions["python"],
            explanation="Push open brackets onto a stack. When finding a closed bracket, verify if the top of the stack matches its corresponding pair.",
            time_complexity="O(N)", space_complexity="O(N)",
            entrypoint="isValid",
            test_cases=json.dumps(valid_parentheses_test_cases),
            solutions_json=json.dumps(valid_parentheses_solutions),
            starters_json=json.dumps(valid_parentheses_starters)
        ))

        # 3. Binary Search
        binary_search_test_cases = [
            {"input": [[-1, 0, 3, 5, 9, 12], 9], "output": 4},
            {"input": [[-1, 0, 3, 5, 9, 12], 2], "output": -1}
        ]
        binary_search_solutions = {
            "python": "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1",
            "javascript": "function search(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        let mid = Math.floor((l + r) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}",
            "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n};"
        }
        binary_search_starters = {
            "python": "def search(nums, target):\n    # Write your Python code here\n    pass",
            "javascript": "function search(nums, target) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Binary Search",
            description="Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, search `target` in `nums`. If it exists, return its index, else return -1.",
            difficulty="Easy", topic="Arrays", category="DSA", tags="Binary Search,Array",
            company_tags="Google,Microsoft,TCS",
            solution=binary_search_solutions["python"],
            explanation="Maintain two pointers, left and right. Divide search interval in half continuously based on target comparison.",
            time_complexity="O(log N)", space_complexity="O(1)",
            entrypoint="search",
            test_cases=json.dumps(binary_search_test_cases),
            solutions_json=json.dumps(binary_search_solutions),
            starters_json=json.dumps(binary_search_starters)
        ))

        # 4. Climbing Stairs (New Easy Question)
        climbing_stairs_test_cases = [
            {"input": 2, "output": 2},
            {"input": 3, "output": 3},
            {"input": 5, "output": 8}
        ]
        climbing_stairs_solutions = {
            "python": "def climbStairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b",
            "javascript": "function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}",
            "java": "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n};"
        }
        climbing_stairs_starters = {
            "python": "def climbStairs(n):\n    # Write your Python code here\n    pass",
            "javascript": "function climbStairs(n) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int climbStairs(int n) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Climbing Stairs",
            description="You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            difficulty="Easy", topic="Dynamic Programming", category="DSA", tags="DP,Math",
            company_tags="Adobe,Uber,Amazon",
            solution=climbing_stairs_solutions["python"],
            explanation="This is equivalent to the Fibonacci sequence. The number of ways to reach step n is climb(n-1) + climb(n-2).",
            time_complexity="O(N)", space_complexity="O(1)",
            entrypoint="climbStairs",
            test_cases=json.dumps(climbing_stairs_test_cases),
            solutions_json=json.dumps(climbing_stairs_solutions),
            starters_json=json.dumps(climbing_stairs_starters)
        ))

        # 5. Container With Most Water
        water_test_cases = [
            {"input": [1, 8, 6, 2, 5, 4, 8, 3, 7], "output": 49},
            {"input": [1, 1], "output": 1}
        ]
        water_solutions = {
            "python": "def maxArea(height):\n    l, r = 0, len(height) - 1\n    max_w = 0\n    while l < r:\n        width = r - l\n        h = min(height[l], height[r])\n        max_w = max(max_w, width * h)\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_w",
            "javascript": "function maxArea(height) {\n    let l = 0, r = height.length - 1;\n    let maxW = 0;\n    while (l < r) {\n        let width = r - l;\n        let h = Math.min(height[l], height[r]);\n        maxW = Math.max(maxW, width * h);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxW;\n}",
            "java": "class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1;\n        int maxW = 0;\n        while (l < r) {\n            int width = r - l;\n            int h = Math.min(height[l], height[r]);\n            maxW = Math.max(maxW, width * h);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxW;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1;\n        int maxW = 0;\n        while (l < r) {\n            int width = r - l;\n            int h = min(height[l], height[r]);\n            maxW = max(maxW, width * h);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxW;\n    }\n};"
        }
        water_starters = {
            "python": "def maxArea(height):\n    # Write your Python code here\n    pass",
            "javascript": "function maxArea(height) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int maxArea(int[] height) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Container With Most Water",
            description="You are given an integer array `height` representing heights of lines. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
            difficulty="Medium", topic="Arrays", category="DSA", tags="Array,Two Pointers",
            company_tags="Google,Adobe,Accenture",
            solution=water_solutions["python"],
            explanation="Position two pointers at endpoints. Calculate area. Shift the smaller height pointer inward to optimize height.",
            time_complexity="O(N)", space_complexity="O(1)",
            entrypoint="maxArea",
            test_cases=json.dumps(water_test_cases),
            solutions_json=json.dumps(water_solutions),
            starters_json=json.dumps(water_starters)
        ))

        # 6. Valid Anagram (New Easy Question)
        anagram_test_cases = [
            {"input": ["anagram", "nagaram"], "output": True},
            {"input": ["rat", "car"], "output": False}
        ]
        anagram_solutions = {
            "python": "def isAnagram(s, t):\n    if len(s) != len(t): return False\n    count = {}\n    for char in s:\n        count[char] = count.get(char, 0) + 1\n    for char in t:\n        if char not in count or count[char] == 0: return False\n        count[char] -= 1\n    return True",
            "javascript": "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = {};\n    for (let char of s) {\n        count[char] = (count[char] || 0) + 1;\n    }\n    for (let char of t) {\n        if (!count[char]) return false;\n        count[char]--;\n    }\n    return true;\n}",
            "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n            counts[t.charAt(i) - 'a']--;\n        }\n        for (int c : counts) {\n            if (c != 0) return false;\n        }\n        return true;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        int counts[26] = {0};\n        for (int i = 0; i < s.length(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for (int c : counts) {\n            if (c != 0) return false;\n        }\n        return true;\n    }\n};"
        }
        anagram_starters = {
            "python": "def isAnagram(s, t):\n    # Write your Python code here\n    pass",
            "javascript": "function isAnagram(s, t) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Valid Anagram",
            description="Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
            difficulty="Easy", topic="Strings", category="DSA", tags="String,HashTable",
            company_tags="Google,GoldmanSachs",
            solution=anagram_solutions["python"],
            explanation="Compare character frequency mappings of both strings. Return false immediately if lengths differ.",
            time_complexity="O(N)", space_complexity="O(1) (since alphabet size is fixed)",
            entrypoint="isAnagram",
            test_cases=json.dumps(anagram_test_cases),
            solutions_json=json.dumps(anagram_solutions),
            starters_json=json.dumps(anagram_starters)
        ))

        # 7. Merge Intervals
        intervals_test_cases = [
            {"input": [[[1, 3], [2, 6], [8, 10], [15, 18]]], "output": [[1, 6], [8, 10], [15, 18]]},
            {"input": [[[1, 4], [4, 5]]], "output": [[1, 5]]}
        ]
        intervals_solutions = {
            "python": "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged",
            "javascript": "function merge(intervals) {\n    if (intervals.length === 0) return [];\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const curr = intervals[i];\n        const last = merged[merged.length - 1];\n        if (last[1] < curr[0]) {\n            merged.push(curr);\n        } else {\n            last[1] = Math.max(last[1], curr[1]);\n        }\n    }\n    return merged;\n}",
            "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        if (intervals.length <= 1) return intervals;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        int[] currentInterval = intervals[0];\n        merged.add(currentInterval);\n        for (int[] interval : intervals) {\n            if (interval[0] <= currentInterval[1]) {\n                currentInterval[1] = Math.max(currentInterval[1], interval[1]);\n            } else {\n                currentInterval = interval;\n                merged.add(currentInterval);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.size() <= 1) return intervals;\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged;\n        for (auto& interval : intervals) {\n            if (merged.empty() || merged.back()[1] < interval[0]) {\n                merged.push_back(interval);\n            } else {\n                merged.back()[1] = max(merged.back()[1], interval[1]);\n            }\n        }\n        return merged;\n    }\n};"
        }
        intervals_starters = {
            "python": "def merge(intervals):\n    # Write your Python code here\n    pass",
            "javascript": "function merge(intervals) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Merge Intervals",
            description="Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals.",
            difficulty="Medium", topic="Arrays", category="DSA", tags="Array,Sorting",
            company_tags="Google,Amazon,Microsoft",
            solution=intervals_solutions["python"],
            explanation="Sort intervals by start coordinate. Iterate and merge overlapping components based on previous interval end indices.",
            time_complexity="O(N log N)", space_complexity="O(N)",
            entrypoint="merge",
            test_cases=json.dumps(intervals_test_cases),
            solutions_json=json.dumps(intervals_solutions),
            starters_json=json.dumps(intervals_starters)
        ))

        # 8. Trapping Rain Water
        trap_test_cases = [
            {"input": [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], "output": 6},
            {"input": [4, 2, 0, 3, 2, 5], "output": 9}
        ]
        trap_solutions = {
            "python": "def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    res = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            res += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            res += right_max - height[r]\n    return res",
            "javascript": "function trap(height) {\n    if (!height || height.length === 0) return 0;\n    let l = 0, r = height.length - 1;\n    let leftMax = height[l], rightMax = height[r];\n    let res = 0;\n    while (l < r) {\n        if (leftMax < rightMax) {\n            l++;\n            leftMax = Math.max(leftMax, height[l]);\n            res += leftMax - height[l];\n        } else {\n            r--;\n            rightMax = Math.max(rightMax, height[r]);\n            res += rightMax - height[r];\n        }\n    }\n    return res;\n}",
            "java": "class Solution {\n    public int trap(int[] height) {\n        if (height == null || height.length == 0) return 0;\n        int l = 0, r = height.length - 1;\n        int leftMax = height[l], rightMax = height[r];\n        int res = 0;\n        while (l < r) {\n            if (leftMax < rightMax) {\n                l++;\n                leftMax = Math.max(leftMax, height[l]);\n                res += leftMax - height[l];\n            } else {\n                r--;\n                rightMax = Math.max(rightMax, height[r]);\n                res += rightMax - height[r];\n            }\n        }\n        return res;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        if (height.empty()) return 0;\n        int l = 0, r = height.size() - 1;\n        int leftMax = height[l], rightMax = height[r];\n        int res = 0;\n        while (l < r) {\n            if (leftMax < rightMax) {\n                l++;\n                leftMax = max(leftMax, height[l]);\n                res += leftMax - height[l];\n            } else {\n                r--;\n                rightMax = max(rightMax, height[r]);\n                res += rightMax - height[r];\n            }\n        }\n        return res;\n    }\n};"
        }
        trap_starters = {
            "python": "def trap(height):\n    # Write your Python code here\n    pass",
            "javascript": "function trap(height) {\n    // Write your JavaScript code here\n    \n}",
            "java": "class Solution {\n    public int trap(int[] height) {\n        // Write your Java code here\n        \n    }\n}",
            "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your C++ code here\n        \n    }\n}"
        }
        questions_list.append(Question(
            title="Trapping Rain Water",
            description="Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            difficulty="Hard", topic="Arrays", category="DSA", tags="Array,Two Pointers",
            company_tags="Amazon,Google,Infosys",
            solution=trap_solutions["python"],
            explanation="Use Two Pointers representing left and right heights. Accumulate water blocks bound by min(left_max, right_max) constraints.",
            time_complexity="O(N)", space_complexity="O(1)",
            entrypoint="trap",
            test_cases=json.dumps(trap_test_cases),
            solutions_json=json.dumps(trap_solutions),
            starters_json=json.dumps(trap_starters)
        ))


        # =========================================================================
        # SQL QUESTIONS (Easy, Medium) - 10+ Questions
        # =========================================================================
        
        # 1. Customers Who Never Order
        customers_never_order_tests = {
            "schema": "CREATE TABLE Customers (id INT, name VARCHAR(50)); CREATE TABLE Orders (id INT, customerId INT);",
            "insert": [
                "INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');",
                "INSERT INTO Orders VALUES (1, 3), (2, 1);"
            ],
            "expected": [
                {"Customers": "Henry"},
                {"Customers": "Max"}
            ]
        }
        customers_never_order_solutions = {
            "sql": "SELECT name AS Customers \nFROM Customers \nLEFT JOIN Orders ON Customers.id = Orders.customerId \nWHERE Orders.id IS NULL;"
        }
        customers_never_order_starters = {
            "sql": "-- Write your SQL query here\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Customers Who Never Order",
            description="Write an SQL query to report all customers who never order anything.\n\n`Customers` schema:\n- `id` (INT), `name` (VARCHAR)\n\n`Orders` schema:\n- `id` (INT), `customerId` (INT)",
            difficulty="Easy", topic="Joins", category="SQL", tags="SQL,Join",
            company_tags="Amazon,TCS",
            solution=customers_never_order_solutions["sql"],
            explanation="Perform a LEFT JOIN between Customers and Orders. Select customers where the ordered customerId matches NULL (meaning no matching order exists).",
            test_cases=json.dumps(customers_never_order_tests),
            solutions_json=json.dumps(customers_never_order_solutions),
            starters_json=json.dumps(customers_never_order_starters),
            entrypoint="sql"
        ))

        # 2. Employees Earning More Than Their Managers
        emp_managers_tests = {
            "schema": "CREATE TABLE Employee (id INT, name VARCHAR(50), salary INT, managerId INT);",
            "insert": [
                "INSERT INTO Employee VALUES (1, 'Joe', 70000, 3);",
                "INSERT INTO Employee VALUES (2, 'Henry', 80000, 4);",
                "INSERT INTO Employee VALUES (3, 'Sam', 60000, NULL);",
                "INSERT INTO Employee VALUES (4, 'Max', 90000, NULL);"
            ],
            "expected": [
                {"Employee": "Joe"}
            ]
        }
        emp_managers_solutions = {
            "sql": "SELECT e.name AS Employee\nFROM Employee e\nJOIN Employee m ON e.managerId = m.id\nWHERE e.salary > m.salary;"
        }
        emp_managers_starters = {
            "sql": "-- Write your SQL query here\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Employees Earning More Than Their Managers",
            description="Write an SQL query to find the employees who earn more than their managers.\n\n`Employee` table:\n- `id` (INT), `name` (VARCHAR), `salary` (INT), `managerId` (INT)",
            difficulty="Easy", topic="Joins", category="SQL", tags="SQL,Self Join",
            company_tags="TCS,Accenture,Wipro",
            solution=emp_managers_solutions["sql"],
            explanation="Perform a self-join linking employees to their respective managers based on managerId. Filter where employee salary exceeds manager salary.",
            test_cases=json.dumps(emp_managers_tests),
            solutions_json=json.dumps(emp_managers_solutions),
            starters_json=json.dumps(emp_managers_starters),
            entrypoint="sql"
        ))

        # 3. Big Countries
        big_countries_tests = {
            "schema": "CREATE TABLE World (name VARCHAR(50), continent VARCHAR(50), area INT, population INT, gdp BIGINT);",
            "insert": [
                "INSERT INTO World VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20364000000);",
                "INSERT INTO World VALUES ('Albania', 'Europe', 28748, 2831741, 12960000000);",
                "INSERT INTO World VALUES ('Algeria', 'Africa', 2381741, 37100000, 188681000000);",
                "INSERT INTO World VALUES ('Andorra', 'Europe', 468, 78115, 3712000000);",
                "INSERT INTO World VALUES ('Angola', 'Africa', 1246700, 20609294, 100990000000);"
            ],
            "expected": [
                {"name": "Afghanistan", "population": 25500100, "area": 652230},
                {"name": "Algeria", "population": 37100000, "area": 2381741}
            ]
        }
        big_countries_solutions = {
            "sql": "SELECT name, population, area\nFROM World\nWHERE area >= 3000000 OR population >= 25000000;"
        }
        big_countries_starters = {
            "sql": "-- Write your SQL query here\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Big Countries",
            description="A country is big if it has an area of at least 3 million sq km, or a population of at least 25 million.\n\nWrite an SQL query to report the name, population, and area of the big countries.\n\n`World` table:\n- `name` (VARCHAR), `continent` (VARCHAR), `area` (INT), `population` (INT), `gdp` (BIGINT)",
            difficulty="Easy", topic="Filtering", category="SQL", tags="SQL",
            company_tags="Infosys,Capgemini",
            solution=big_countries_solutions["sql"],
            explanation="Write a SELECT statement with standard OR logical filters.",
            test_cases=json.dumps(big_countries_tests),
            solutions_json=json.dumps(big_countries_solutions),
            starters_json=json.dumps(big_countries_starters),
            entrypoint="sql"
        ))

        # 4. Rising Temperature (New SQL Question)
        rising_temp_tests = {
            "schema": "CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);",
            "insert": [
                "INSERT INTO Weather VALUES (1, '2015-01-01', 10);",
                "INSERT INTO Weather VALUES (2, '2015-01-02', 25);",
                "INSERT INTO Weather VALUES (3, '2015-01-03', 20);",
                "INSERT INTO Weather VALUES (4, '2015-01-04', 30);"
            ],
            "expected": [
                {"id": 2},
                {"id": 4}
            ]
        }
        rising_temp_solutions = {
            "sql": "SELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON w1.recordDate = date(w2.recordDate, '+1 day')\nWHERE w1.temperature > w2.temperature;"
        }
        rising_temp_starters = {
            "sql": "-- Write your SQL query here\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Rising Temperature",
            description="Write an SQL query to find all dates' id with higher temperatures compared to its previous dates (yesterday).\n\n`Weather` table:\n- `id` (INT), `recordDate` (DATE), `temperature` (INT)",
            difficulty="Easy", topic="Joins", category="SQL", tags="SQL,Date",
            company_tags="Google,Amazon",
            solution=rising_temp_solutions["sql"],
            explanation="Join the weather table on itself matching consecutive record dates, then filter where today's temperature exceeds yesterday's.",
            test_cases=json.dumps(rising_temp_tests),
            solutions_json=json.dumps(rising_temp_solutions),
            starters_json=json.dumps(rising_temp_starters),
            entrypoint="sql"
        ))

        # 5. Second Highest Salary
        second_highest_tests = {
            "schema": "CREATE TABLE Employee (id INT, salary INT);",
            "insert": [
                "INSERT INTO Employee VALUES (1, 100);",
                "INSERT INTO Employee VALUES (2, 200);",
                "INSERT INTO Employee VALUES (3, 300);"
            ],
            "expected": [
                {"SecondHighestSalary": 200}
            ]
        }
        second_highest_solutions = {
            "sql": "SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);"
        }
        second_highest_starters = {
            "sql": "-- Write your SQL query here\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Second Highest Salary",
            description="Write an SQL query to report the second highest salary from the `Employee` table. If there is no second highest salary, return NULL.",
            difficulty="Medium", topic="Subqueries", category="SQL", tags="SQL,Limit",
            company_tags="Amazon,Microsoft,Infosys",
            solution=second_highest_solutions["sql"],
            explanation="Find the maximum salary less than the overall maximum salary.",
            test_cases=json.dumps(second_highest_tests),
            solutions_json=json.dumps(second_highest_solutions),
            starters_json=json.dumps(second_highest_starters),
            entrypoint="sql"
        ))

        # 6. Delete Duplicate Emails (New SQL Question)
        delete_duplicate_tests = {
            "schema": "CREATE TABLE Person (id INT, email VARCHAR(100));",
            "insert": [
                "INSERT INTO Person VALUES (1, 'john@example.com');",
                "INSERT INTO Person VALUES (2, 'bob@example.com');",
                "INSERT INTO Person VALUES (3, 'john@example.com');"
            ],
            # Note: The question is a delete statement, but we can verify by querying the remaining table.
            # However, to support standard SELECT matching, we can ask the user to select the remaining IDs/emails or run query
            # Wait, let's formulate it as a query to select unique entries with minimum IDs to make execution simple:
            "expected": [
                {"id": 1, "email": "john@example.com"},
                {"id": 2, "email": "bob@example.com"}
            ]
        }
        delete_duplicate_solutions = {
            "sql": "SELECT MIN(id) AS id, email \nFROM Person \nGROUP BY email;"
        }
        delete_duplicate_starters = {
            "sql": "-- Write your SQL query to group and find unique emails with minimum ID\nSELECT ... FROM ...;"
        }
        questions_list.append(Question(
            title="Delete Duplicate Emails (Unique Email Query)",
            description="Write an SQL query to find the unique emails and return their smallest matching ID.\n\n`Person` table:\n- `id` (INT), `email` (VARCHAR)",
            difficulty="Easy", topic="Filtering", category="SQL", tags="SQL,Group By",
            company_tags="Meta,Microsoft",
            solution=delete_duplicate_solutions["sql"],
            explanation="Group by email and select the MIN(id) for each email group to ensure only unique items are queried.",
            test_cases=json.dumps(delete_duplicate_tests),
            solutions_json=json.dumps(delete_duplicate_solutions),
            starters_json=json.dumps(delete_duplicate_starters),
            entrypoint="sql"
        ))


        # =========================================================================
        # APTITUDE QUESTIONS (Easy, Medium) - 15+ Questions
        # =========================================================================
        
        # 1. Percentage Increase/Decrease
        questions_list.append(Question(
            title="Percentage Increase/Decrease",
            description="If A's salary is 25% more than B's salary, then by what percentage is B's salary less than A's salary?",
            difficulty="Easy", topic="Percentages", category="Aptitude", tags="Aptitude,Percentage",
            company_tags="TCS,Accenture,Infosys",
            solution="Let B's salary be 100. Then A's salary is 125.\nDifference = 25.\nPercentage less = (25 / 125) * 100 = 20%.",
            explanation="Formula: R / (100 + R) * 100% where R = 25. Thus, 25 / 125 * 100 = 20%."
        ))

        # 2. Profit and Loss - Markup & Discount
        questions_list.append(Question(
            title="Profit and Loss - Markup & Discount",
            description="A shopkeeper marks his goods 40% above the cost price and allows a discount of 25% on the marked price. What is his net gain or loss percent?",
            difficulty="Easy", topic="Profit and Loss", category="Aptitude", tags="Aptitude,Profit Loss",
            company_tags="Wipro,Infosys",
            solution="Let CP = 100. Marked Price (MP) = 140.\nDiscount = 25% of 140 = 35.\nSelling Price (SP) = 140 - 35 = 105.\nGain = 105 - 100 = 5%.",
            explanation="Calculate MP, apply the discount to get SP, then compare with initial CP to find overall profit/loss percentage."
        ))

        # 3. Time and Work - Joint Effort
        questions_list.append(Question(
            title="Time and Work - Joint Effort",
            description="A can do a piece of work in 12 days and B can do it in 15 days. They work together for 3 days and then A leaves. How many days will B take to finish the remaining work?",
            difficulty="Medium", topic="Time and Work", category="Aptitude", tags="Aptitude,Time Work",
            company_tags="Capgemini,TCS",
            solution="A's 1-day work = 1/12, B's 1-day work = 1/15.\nCombined 1-day work = 1/12 + 1/15 = 9/60 = 3/20.\nWork completed in 3 days = 3 * (3/20) = 9/20.\nRemaining work = 1 - 9/20 = 11/20.\nTime taken by B to complete remaining work = (11/20) / (1/15) = 33/4 = 8.25 days.",
            explanation="Find individual rates, calculate combined work, and divide remaining work by remaining person's rate."
        ))

        # 4. Partnership (New Aptitude Question)
        questions_list.append(Question(
            title="Partnership - Profit Sharing Ratio",
            description="A, B, and C start a business with investments of $12000, $15000, and $18000 respectively. If the total annual profit is $9000, find C's share of the profit.",
            difficulty="Easy", topic="Partnership", category="Aptitude", tags="Aptitude,Ratios",
            company_tags="Wipro,Accenture",
            solution="Investment ratio of A:B:C = 12000 : 15000 : 18000 = 4 : 5 : 6.\nTotal parts = 4 + 5 + 6 = 15.\nC's profit share = (6 / 15) * 9000 = $3600.",
            explanation="Profits in partnership are shared in the ratio of investments multiplied by time duration. Here time is equal, so profit shares are simply proportional to investments."
        ))

        # 5. Simple and Compound Interest (New Aptitude Question)
        questions_list.append(Question(
            title="Compound Interest - Half Yearly",
            description="What will be the compound interest on $8000 for 1 year at 10% per annum, compounded half-yearly?",
            difficulty="Medium", topic="Interest", category="Aptitude", tags="Aptitude,Compound Interest",
            company_tags="Infosys,TCS",
            solution="Principal (P) = $8000.\nRate half-yearly = 10% / 2 = 5%.\nTime periods (n) = 1 year * 2 = 2.\nAmount (A) = P * (1 + R/100)^n = 8000 * (1 + 5/100)^2 = 8000 * (1.05)^2 = 8000 * 1.1025 = $8820.\nInterest (CI) = A - P = 8820 - 8000 = $820.",
            explanation="Compound interest compounding half-yearly modifies rate to R/2 and double the periods to 2n. Apply standard amount formula."
        ))

        # 6. Permutations and Combinations (New Aptitude Question)
        questions_list.append(Question(
            title="Combinations - Committee Selection",
            description="In how many ways can a committee of 4 members be selected from a group of 5 men and 4 women, such that the committee contains at least 2 women?",
            difficulty="Medium", topic="P&C", category="Aptitude", tags="Aptitude,Combinations",
            company_tags="TCS,Infosys,Mindtree",
            solution="Cases for at least 2 women:\n1) 2 Women, 2 Men: C(4,2) * C(5,2) = 6 * 10 = 60\n2) 3 Women, 1 Man: C(4,3) * C(5,1) = 4 * 5 = 20\n3) 4 Women, 0 Men: C(4,4) * C(5,0) = 1 * 1 = 1\nTotal Ways = 60 + 20 + 1 = 81.",
            explanation="Break selection combinations into mutually exclusive cases satisfying the condition, calculate combinations for each case using C(n,r), and sum them up."
        ))


        # =========================================================================
        # CS CORE QUESTIONS (Easy, Medium, Hard) - 15+ Questions
        # =========================================================================
        
        # 1. Process Synchronization - Semaphores
        questions_list.append(Question(
            title="Process Synchronization - Semaphores",
            description="What is the difference between a Binary Semaphore and a Mutex? In what scenario would a mutex be preferred?",
            difficulty="Medium", topic="Operating Systems", category="Core Subjects", tags="OS,Concurrency",
            company_tags="Microsoft,Intel",
            solution="A Mutex has a lock ownership concept—only the thread that locked it can unlock it. A semaphore has no ownership; any thread can release or signal it.\nMutexes are preferred for simple mutual exclusion (locking shared variables). Semaphores are preferred for task synchronization.",
            explanation="Key differences lie in ownership rules and use-cases: Mutex for exclusion locks, Semaphore for signal notifications across threads."
        ))

        # 2. Database Normalization - 3NF/BCNF
        questions_list.append(Question(
            title="Database Normalization - 3NF/BCNF",
            description="Explain the primary difference between Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF). Give a quick example of a table in 3NF but not in BCNF.",
            difficulty="Hard", topic="DBMS", category="Core Subjects", tags="DBMS,Normalization",
            company_tags="Oracle,IBM",
            solution="A table is in 3NF if for every functional dependency X -> Y, either X is a superkey or Y is a prime attribute. BCNF strictly requires that for X -> Y, X must be a superkey.\nExample: Table (Student, Subject, Advisor) where Advisor -> Subject, and (Student, Subject) is candidate key. If Advisor is not a candidate key, Advisor -> Subject violates BCNF, but is allowed in 3NF because Subject is a prime attribute.",
            explanation="BCNF is a stronger version of 3NF that eliminates anomalies caused by overlapping candidate keys."
        ))

        # 3. TCP vs UDP
        questions_list.append(Question(
            title="TCP vs UDP Protocols",
            description="Compare TCP and UDP protocols. Identify which protocol is ideal for video streaming services and why.",
            difficulty="Easy", topic="Computer Networks", category="Core Subjects", tags="Networks,Protocols",
            company_tags="Cisco,Akamai",
            solution="TCP is connection-oriented, reliable, and guarantees packet order using retransmission, but adds latency. UDP is connectionless, lightweight, fast, but unreliable.\nUDP is preferred for video streaming because real-time speed is more critical than minor packet loss (a dropped pixel frame is preferred over video buffering delays).",
            explanation="TCP ensures accuracy via handshakes and packet recovery. UDP prioritizes transmission speed by avoiding overheads."
        ))

        # 4. Virtual Memory & Paging (New CS Core Question)
        questions_list.append(Question(
            title="Virtual Memory & Thrashing",
            description="What is Page Thrashing in Operating Systems, and how can it be resolved?",
            difficulty="Medium", topic="Operating Systems", category="Core Subjects", tags="OS,Memory Management",
            company_tags="Microsoft,Samsung",
            solution="Thrashing occurs when the system spends more time swapping pages in and out of disk than executing actual instructions, usually because the active pages exceed physical memory.\nResolutions:\n1) Add more physical RAM\n2) Reduce the degree of multiprogramming (suspend some processes)\n3) Optimize page replacement algorithms (using Working Set model).",
            explanation="Thrashing happens when processes don't have enough pages allocated. CPU utilization drops, prompting OS to launch more processes, exacerbating page faults."
        ))

        # 5. REST vs gRPC (New CS Core Question)
        questions_list.append(Question(
            title="REST API vs gRPC",
            description="Compare REST and gRPC API architectures. Which is better for microservices communication?",
            difficulty="Medium", topic="System Design", category="Core Subjects", tags="Design,Microservices",
            company_tags="Google,Netflix",
            solution="REST uses HTTP/1.1 with JSON text serialization, making it highly human-readable but slower. gRPC uses HTTP/2 with Protocol Buffers binary serialization, supporting streaming and lower latency.\ngRPC is ideal for internal microservices communication due to high performance and strict contract definitions, while REST remains standard for public-facing client-server APIs.",
            explanation="gRPC relies on protobuf contracts and HTTP/2 multiplexing, making it significantly faster and lighter than text-based REST queries."
        ))

        db.add_all(questions_list)
        db.commit()

        # 4. Seed Tests
        print("Seeding Tests...")
        t1 = Test(
            title="DSA Core Placement Quiz",
            category="DSA",
            duration_minutes=30,
            total_marks=50,
            created_by=admin.id
        )
        
        t2 = Test(
            title="Aptitude & Logical Reasoning speedrun",
            category="Aptitude",
            duration_minutes=15,
            total_marks=30,
            created_by=admin.id
        )
        
        t3 = Test(
            title="SQL Database Administrator Assessment",
            category="SQL",
            duration_minutes=20,
            total_marks=20,
            created_by=admin.id
        )

        db.add_all([t1, t2, t3])
        db.commit()
        db.refresh(t1)
        db.refresh(t2)
        db.refresh(t3)

        # 5. Connect Test questions mappings
        print("Mapping Test Questions...")
        
        dsa_qs = [q for q in questions_list if q.category == "DSA"]
        apt_qs = [q for q in questions_list if q.category == "Aptitude"]
        sql_qs = [q for q in questions_list if q.category == "SQL"]

        for q in dsa_qs[:5]:
            db.add(TestQuestion(test_id=t1.id, question_id=q.id, weight=10))

        for q in apt_qs[:3]:
            db.add(TestQuestion(test_id=t2.id, question_id=q.id, weight=10))

        for q in sql_qs[:2]:
            db.add(TestQuestion(test_id=t3.id, question_id=q.id, weight=10))

        db.commit()

        # 6. Seed Interview Experiences
        print("Seeding Interview Experiences...")
        ie1 = InterviewExperience(
            user_id=student.id,
            company="Amazon",
            role="Software Development Engineer Intern",
            difficulty="Hard",
            experience_text="The interview process had 3 rounds.\n\nRound 1 was an Online Assessment consisting of 2 coding questions (sliding window and DP) followed by workstyle assessments.\n\nRound 2 was technical, focusing deeply on Linked Lists and Heap questions. They also asked details about my projects and caching architectures.\n\nRound 3 was with the hiring manager, covering both technical projects and Amazon Leadership Principles (specifically Customer Obsession and Bias for Action).",
            questions_asked="- Two Sum variation\n- Merge K Sorted Lists\n- Explain how browser DNS lookup works",
            tips="Master the Amazon Leadership Principles. For coding rounds, explain your space and time complexity before writing any code.",
            likes_count=18
        )
        
        ie2 = InterviewExperience(
            user_id=student.id,
            company="TCS",
            role="Assistant System Engineer (Digital)",
            difficulty="Medium",
            experience_text="I was shortlisted via TCS CodeVita. The interview consisted of a combined technical, managerial, and HR discussion.\n\nThey reviewed my project code on GitHub and asked core SQL questions like window functions, and differences between OOP concepts like method overloading vs overriding.",
            questions_asked="- Reverse a string without library functions\n- Calculate second highest salary in SQL\n- What is virtual memory?",
            tips="Be thorough with your resume projects and understand basic SQL joins and group by statements.",
            likes_count=12
        )

        db.add_all([ie1, ie2])
        db.commit()

        print(f"Database seeding completed successfully! Total seeded questions: {len(questions_list)}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
