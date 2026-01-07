export type Difficulty = "Easy" | "Medium" | "Hard";

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  templates: Record<string, string>;
}

export const codingChallenges: CodingChallenge[] = [
  // Easy Challenges
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      }
    ],
    templates: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test your solution
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]`,
      java: `import java.util.Arrays;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`,
    }
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    templates: {
      javascript: `function isPalindrome(x) {
  // Write your solution here
  
}

// Test your solution
console.log(isPalindrome(121));  // Expected: true
console.log(isPalindrome(-121)); // Expected: false`,
      python: `def is_palindrome(x):
    # Write your solution here
    pass

# Test your solution
print(is_palindrome(121))   # Expected: True
print(is_palindrome(-121))  # Expected: False`,
      java: `class Solution {
    public static boolean isPalindrome(int x) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome(121));   // Expected: true
        System.out.println(isPalindrome(-121));  // Expected: false
    }
}`,
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isPalindrome(121) << endl;   // Expected: true
    cout << boolalpha << isPalindrome(-121) << endl;  // Expected: false
    return 0;
}`,
      typescript: `function isPalindrome(x: number): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isPalindrome(121));  // Expected: true
console.log(isPalindrome(-121)); // Expected: false`,
    }
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The array is reversed in place."
      }
    ],
    templates: {
      javascript: `function reverseString(s) {
  // Write your solution here - modify s in-place
  
}

// Test your solution
const arr = ["h","e","l","l","o"];
reverseString(arr);
console.log(arr); // Expected: ["o","l","l","e","h"]`,
      python: `def reverse_string(s):
    # Write your solution here - modify s in-place
    pass

# Test your solution
arr = ["h","e","l","l","o"]
reverse_string(arr)
print(arr)  # Expected: ["o","l","l","e","h"]`,
      java: `import java.util.Arrays;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here - modify s in-place
    }
    
    public static void main(String[] args) {
        char[] arr = {'h','e','l','l','o'};
        reverseString(arr);
        System.out.println(Arrays.toString(arr)); // Expected: [o, l, l, e, h]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here - modify s in-place
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    for (char c : s) cout << c << " ";
    cout << endl; // Expected: o l l e h
    return 0;
}`,
      typescript: `function reverseString(s: string[]): void {
  // Write your solution here - modify s in-place
  
}

// Test your solution
const arr = ["h","e","l","l","o"];
reverseString(arr);
console.log(arr); // Expected: ["o","l","l","e","h"]`,
    }
  },
  // Medium Challenges
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    templates: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}

// Test your solution
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb"));    // Expected: 1`,
      python: `def length_of_longest_substring(s):
    # Write your solution here
    pass

# Test your solution
print(length_of_longest_substring("abcabcbb"))  # Expected: 3
print(length_of_longest_substring("bbbbb"))     # Expected: 1`,
      java: `class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl; // Expected: 3
    cout << lengthOfLongestSubstring("bbbbb") << endl;    // Expected: 1
    return 0;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb"));    // Expected: 1`,
    }
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807, represented as [7,0,8] in reverse order."
      }
    ],
    templates: {
      javascript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function addTwoNumbers(l1, l2) {
  // Write your solution here
  
}

// Helper to create list from array
function createList(arr) {
  let dummy = new ListNode();
  let curr = dummy;
  for (let n of arr) {
    curr.next = new ListNode(n);
    curr = curr.next;
  }
  return dummy.next;
}

// Test your solution
const l1 = createList([2,4,3]);
const l2 = createList([5,6,4]);
let result = addTwoNumbers(l1, l2);
let output = [];
while (result) { output.push(result.val); result = result.next; }
console.log(output); // Expected: [7,0,8]`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1, l2):
    # Write your solution here
    pass

# Helper to create list from array
def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for n in arr:
        curr.next = ListNode(n)
        curr = curr.next
    return dummy.next

# Test your solution
l1 = create_list([2,4,3])
l2 = create_list([5,6,4])
result = add_two_numbers(l1, l2)
output = []
while result:
    output.append(result.val)
    result = result.next
print(output)  # Expected: [7, 0, 8]`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your solution here
        return null;
    }
    
    public static ListNode createList(int[] arr) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int n : arr) {
            curr.next = new ListNode(n);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static void main(String[] args) {
        ListNode l1 = createList(new int[]{2,4,3});
        ListNode l2 = createList(new int[]{5,6,4});
        ListNode result = addTwoNumbers(l1, l2);
        while (result != null) {
            System.out.print(result.val + " ");
            result = result.next;
        } // Expected: 7 0 8
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    // Write your solution here
    return nullptr;
}

ListNode* createList(vector<int>& arr) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    for (int n : arr) {
        curr->next = new ListNode(n);
        curr = curr->next;
    }
    return dummy.next;
}

int main() {
    vector<int> a1 = {2,4,3}, a2 = {5,6,4};
    ListNode* l1 = createList(a1);
    ListNode* l2 = createList(a2);
    ListNode* result = addTwoNumbers(l1, l2);
    while (result) {
        cout << result->val << " ";
        result = result->next;
    } // Expected: 7 0 8
    return 0;
}`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // Write your solution here
  return null;
}

// Helper to create list from array
function createList(arr: number[]): ListNode | null {
  let dummy = new ListNode();
  let curr = dummy;
  for (let n of arr) {
    curr.next = new ListNode(n);
    curr = curr.next;
  }
  return dummy.next;
}

// Test your solution
const l1 = createList([2,4,3]);
const l2 = createList([5,6,4]);
let result = addTwoNumbers(l1, l2);
let output: number[] = [];
while (result) { output.push(result.val); result = result.next; }
console.log(output); // Expected: [7,0,8]`,
    }
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    description: "You are given an integer array height of length n. There are n vertical lines drawn. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The maximum area is between lines at index 1 and 8, giving area = min(8,7) * (8-1) = 49."
      }
    ],
    templates: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test your solution
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1]));               // Expected: 1`,
      python: `def max_area(height):
    # Write your solution here
    pass

# Test your solution
print(max_area([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(max_area([1,1]))                # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1}));               // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> h1 = {1,8,6,2,5,4,8,3,7};
    vector<int> h2 = {1,1};
    cout << maxArea(h1) << endl; // Expected: 49
    cout << maxArea(h2) << endl; // Expected: 1
    return 0;
}`,
      typescript: `function maxArea(height: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1]));               // Expected: 1`,
    }
  },
  // Hard Challenges
  {
    id: "median-two-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        explanation: "Merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.5",
        explanation: "Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    templates: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}

// Test your solution
console.log(findMedianSortedArrays([1,3], [2]));   // Expected: 2.0
console.log(findMedianSortedArrays([1,2], [3,4])); // Expected: 2.5`,
      python: `def find_median_sorted_arrays(nums1, nums2):
    # Write your solution here
    pass

# Test your solution
print(find_median_sorted_arrays([1,3], [2]))    # Expected: 2.0
print(find_median_sorted_arrays([1,2], [3,4]))  # Expected: 2.5`,
      java: `class Solution {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
        return 0.0;
    }
    
    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1,3}, new int[]{2}));   // Expected: 2.0
        System.out.println(findMedianSortedArrays(new int[]{1,2}, new int[]{3,4})); // Expected: 2.5
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Write your solution here
    return 0.0;
}

int main() {
    vector<int> n1 = {1,3}, n2 = {2};
    vector<int> n3 = {1,2}, n4 = {3,4};
    cout << findMedianSortedArrays(n1, n2) << endl; // Expected: 2.0
    cout << findMedianSortedArrays(n3, n4) << endl; // Expected: 2.5
    return 0;
}`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(findMedianSortedArrays([1,3], [2]));   // Expected: 2.0
console.log(findMedianSortedArrays([1,2], [3,4])); // Expected: 2.5`,
    }
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are merged into one sorted list."
      }
    ],
    templates: {
      javascript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeKLists(lists) {
  // Write your solution here
  
}

// Helper to create list from array
function createList(arr) {
  if (!arr.length) return null;
  let dummy = new ListNode();
  let curr = dummy;
  for (let n of arr) {
    curr.next = new ListNode(n);
    curr = curr.next;
  }
  return dummy.next;
}

// Test your solution
const lists = [[1,4,5],[1,3,4],[2,6]].map(createList);
let result = mergeKLists(lists);
let output = [];
while (result) { output.push(result.val); result = result.next; }
console.log(output); // Expected: [1,1,2,3,4,4,5,6]`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    # Write your solution here
    pass

# Helper to create list from array
def create_list(arr):
    if not arr: return None
    dummy = ListNode()
    curr = dummy
    for n in arr:
        curr.next = ListNode(n)
        curr = curr.next
    return dummy.next

# Test your solution
lists = [create_list(arr) for arr in [[1,4,5],[1,3,4],[2,6]]]
result = merge_k_lists(lists)
output = []
while result:
    output.append(result.val)
    result = result.next
print(output)  # Expected: [1, 1, 2, 3, 4, 4, 5, 6]`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here
        return null;
    }
    
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int n : arr) {
            curr.next = new ListNode(n);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static void main(String[] args) {
        ListNode[] lists = new ListNode[]{
            createList(new int[]{1,4,5}),
            createList(new int[]{1,3,4}),
            createList(new int[]{2,6})
        };
        ListNode result = mergeKLists(lists);
        while (result != null) {
            System.out.print(result.val + " ");
            result = result.next;
        } // Expected: 1 1 2 3 4 4 5 6
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Write your solution here
    return nullptr;
}

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode dummy(0);
    ListNode* curr = &dummy;
    for (int n : arr) {
        curr->next = new ListNode(n);
        curr = curr->next;
    }
    return dummy.next;
}

int main() {
    vector<vector<int>> arrs = {{1,4,5},{1,3,4},{2,6}};
    vector<ListNode*> lists;
    for (auto& arr : arrs) lists.push_back(createList(arr));
    ListNode* result = mergeKLists(lists);
    while (result) {
        cout << result->val << " ";
        result = result->next;
    } // Expected: 1 1 2 3 4 4 5 6
    return 0;
}`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  // Write your solution here
  return null;
}

// Helper to create list from array
function createList(arr: number[]): ListNode | null {
  if (!arr.length) return null;
  let dummy = new ListNode();
  let curr = dummy;
  for (let n of arr) {
    curr.next = new ListNode(n);
    curr = curr.next;
  }
  return dummy.next;
}

// Test your solution
const lists = [[1,4,5],[1,3,4],[2,6]].map(createList);
let result = mergeKLists(lists);
let output: number[] = [];
while (result) { output.push(result.val); result = result.next; }
console.log(output); // Expected: [1,1,2,3,4,4,5,6]`,
    }
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map can trap 6 units of rain water."
      }
    ],
    templates: {
      javascript: `function trap(height) {
  // Write your solution here
  
}

// Test your solution
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log(trap([4,2,0,3,2,5]));             // Expected: 9`,
      python: `def trap(height):
    # Write your solution here
    pass

# Test your solution
print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # Expected: 6
print(trap([4,2,0,3,2,5]))              # Expected: 9`,
      java: `class Solution {
    public static int trap(int[] height) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // Expected: 6
        System.out.println(trap(new int[]{4,2,0,3,2,5}));             // Expected: 9
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int trap(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> h1 = {0,1,0,2,1,0,1,3,2,1,2,1};
    vector<int> h2 = {4,2,0,3,2,5};
    cout << trap(h1) << endl; // Expected: 6
    cout << trap(h2) << endl; // Expected: 9
    return 0;
}`,
      typescript: `function trap(height: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log(trap([4,2,0,3,2,5]));             // Expected: 9`,
    }
  }
];

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    case "Hard":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
  }
};
