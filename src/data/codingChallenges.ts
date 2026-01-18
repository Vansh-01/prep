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

// Hints for each challenge - progressively reveals solution approaches
export const challengeHints: Record<string, string[]> = {
  "two-sum": [
    "Think about what information you need to find: for each number, you need to check if (target - number) exists.",
    "A brute force approach would check every pair - but can you do better using a data structure for O(1) lookups?",
    "Use a hash map to store numbers you've seen and their indices. For each number, check if (target - num) is already in the map."
  ],
  "palindrome-number": [
    "Negative numbers cannot be palindromes. Also think about numbers ending in 0.",
    "You could convert to a string, but can you solve it mathematically without extra space?",
    "Try reversing only half the number and compare. When the reversed half equals or exceeds the remaining half, you've reached the middle."
  ],
  "reverse-string": [
    "You need to modify the array in-place with O(1) extra memory.",
    "Think about using two pointers - one at the start and one at the end.",
    "Swap characters at the two pointers, then move them toward each other until they meet."
  ],
  "longest-substring": [
    "You need to track which characters are in the current window.",
    "Consider using a sliding window approach with two pointers.",
    "Use a Set or Map to track characters. When you find a duplicate, shrink the window from the left until it's valid again."
  ],
  "add-two-numbers": [
    "Think about how you add numbers digit by digit, handling carry.",
    "Traverse both lists simultaneously, summing corresponding digits plus any carry.",
    "Create a dummy head node to simplify list construction. Don't forget to handle the final carry!"
  ],
  "container-with-most-water": [
    "The area is determined by the shorter line and the distance between lines.",
    "Consider starting with the widest container (first and last lines).",
    "Use two pointers. Move the pointer pointing to the shorter line inward, as that's the only way to potentially find a larger area."
  ],
  "median-sorted-arrays": [
    "The median divides the combined array into two equal halves.",
    "Binary search can help find the correct partition point in O(log(min(m,n))) time.",
    "Partition both arrays such that all elements on the left are smaller than all elements on the right. Adjust the partition using binary search on the smaller array."
  ],
  "longest-palindromic-substring": [
    "A palindrome mirrors around its center.",
    "Consider expanding around each center (both single characters and pairs).",
    "For each position, try expanding outward while characters match. Track the longest palindrome found. Handle both odd and even length palindromes."
  ],
  "trapping-rain-water": [
    "Water at each position depends on the maximum heights on both sides.",
    "For each bar, water trapped = min(maxLeft, maxRight) - height[i].",
    "Use two arrays to precompute max heights from left and right, or use two pointers moving inward to compute on the fly."
  ],
  "valid-parentheses": [
    "Each closing bracket must match the most recent unmatched opening bracket.",
    "Use a stack to keep track of opening brackets.",
    "When you see a closing bracket, check if it matches the top of the stack. The string is valid if the stack is empty at the end."
  ],
  "merge-sorted-array": [
    "You have extra space at the end of nums1 to accommodate nums2.",
    "Starting from the end avoids overwriting elements you still need.",
    "Use three pointers: one at the end of nums1's values (m-1), one at the end of nums2 (n-1), and one at the end of nums1 (m+n-1). Fill from the back."
  ],
  "best-time-to-buy-sell-stock": [
    "You need to find the maximum difference between a later price and an earlier price.",
    "Track the minimum price seen so far as you iterate.",
    "For each price, calculate profit if you sold at that price (price - minPrice). Update maxProfit and minPrice as you go."
  ],
  "climbing-stairs": [
    "To reach step n, you could have come from step n-1 or step n-2.",
    "This is similar to the Fibonacci sequence.",
    "Use dynamic programming: dp[n] = dp[n-1] + dp[n-2]. You only need to track the last two values to save space."
  ],
  "contains-duplicate": [
    "You need to check if any element appears more than once.",
    "A data structure for O(1) lookups would help.",
    "Use a Set. As you iterate, check if the element is already in the set. If yes, return true. Otherwise, add it."
  ],
  "single-number": [
    "Every element appears twice except one. Think about a property that cancels out pairs.",
    "XOR has a useful property: a XOR a = 0, and a XOR 0 = a.",
    "XOR all numbers together. Pairs will cancel out, leaving only the single number."
  ],
  "3sum": [
    "If you sort the array first, you can avoid duplicates more easily.",
    "For each number, the problem reduces to finding two numbers that sum to the negative of that number.",
    "Fix one number, then use two pointers on the remaining sorted array to find pairs. Skip duplicates at each step."
  ],
  "group-anagrams": [
    "Anagrams have the same characters in different orders.",
    "Think about what property is shared by all anagrams of a word.",
    "Sort each string to get a canonical form, or count character frequencies. Use this as a hash map key to group anagrams."
  ],
  "product-of-array-except-self": [
    "You can't use division. Think about prefix and suffix products.",
    "For each element, the result is (product of all elements before it) × (product of all elements after it).",
    "First pass: compute prefix products. Second pass: multiply by suffix products. You can do this in-place using the result array."
  ],
  "rotate-image": [
    "Try to find a pattern by tracking where each element moves.",
    "The rotation can be achieved by transposing the matrix, then reversing each row.",
    "Transpose (swap matrix[i][j] with matrix[j][i]), then reverse each row to get 90° clockwise rotation."
  ],
  "coin-change": [
    "This is an optimization problem - think about dynamic programming.",
    "Define dp[amount] as the minimum coins needed to make that amount.",
    "For each amount from 1 to target, try each coin. dp[i] = min(dp[i], dp[i-coin] + 1) if i-coin >= 0."
  ],
  "validate-bst": [
    "A BST has the property that all left subtree nodes are less than the node, and all right subtree nodes are greater.",
    "Checking only immediate children isn't enough - you need to track valid ranges.",
    "Pass down min and max bounds. For left child, update max. For right child, update min. Use null or infinity for initial bounds."
  ],
  "lru-cache": [
    "You need O(1) access and O(1) removal/insertion of the least recently used item.",
    "Combine a hash map (for O(1) access) with a data structure that maintains order.",
    "Use a doubly linked list to maintain usage order, and a hash map from key to list node. Move accessed nodes to the front; remove from the back when full."
  ],
  "merge-k-sorted-lists": [
    "Think about how you would merge two sorted lists, then extend.",
    "A min-heap can efficiently find the smallest among k elements.",
    "Use a min-heap containing the head of each list. Pop the minimum, add it to the result, and push that node's next (if exists) to the heap."
  ],
  "word-search-ii": [
    "Searching for each word separately would be inefficient.",
    "Use a Trie to store all words and search them simultaneously.",
    "Build a Trie from words. DFS from each cell, following Trie nodes. Mark found words and backtrack. Optimize by removing found words from Trie."
  ],
  "regular-expression-matching": [
    "The '*' can match zero or more of the preceding character.",
    "Consider using dynamic programming where dp[i][j] means s[0..i) matches p[0..j).",
    "Handle cases: if p[j-1] == s[i-1] or '.', inherit dp[i-1][j-1]. If p[j-1] == '*', either use zero occurrences (dp[i][j-2]) or match one more (dp[i-1][j] if char matches)."
  ],
  "serialize-deserialize-binary-tree": [
    "You need to encode the tree structure including null nodes.",
    "Use a traversal (BFS or preorder DFS) and mark null nodes explicitly.",
    "Serialize: Use preorder traversal, output values separated by delimiter, use 'null' for missing nodes. Deserialize: Parse values and reconstruct using the same traversal order."
  ],
  "longest-valid-parentheses": [
    "Track the length of valid substrings ending at each position.",
    "Use a stack to track indices of unmatched parentheses.",
    "Push '(' indices onto stack. On ')', pop and calculate length from the new top of stack (or from -1 if empty). Keep a base index for calculation."
  ],
  "alien-dictionary": [
    "The order of characters can be derived by comparing adjacent words.",
    "This is a topological sort problem on a graph of character orderings.",
    "Build a graph: for each pair of adjacent words, find the first differing character - that gives an edge. Use topological sort (Kahn's or DFS) to find the order."
  ],
  "minimum-window-substring": [
    "You need to find the smallest window containing all characters of t.",
    "Use a sliding window with two pointers.",
    "Expand the right pointer until you have all characters of t. Then shrink from the left to minimize. Use a hash map to track character counts needed."
  ],
  // New Easy Challenges
  "roman-to-integer": [
    "Roman numerals have specific values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
    "When a smaller value precedes a larger value, it's subtracted (like IV=4).",
    "Iterate from left to right. If current value < next value, subtract it; otherwise add it."
  ],
  "remove-duplicates-sorted-array": [
    "The array is already sorted, so duplicates are adjacent.",
    "Use two pointers: one for the position to place unique elements, one to iterate.",
    "Compare each element with the previous unique one. If different, copy it to the unique pointer position."
  ],
  "plus-one": [
    "Think about what happens when you add 1 to 9.",
    "Start from the rightmost digit and handle carry propagation.",
    "If a digit becomes 10, set it to 0 and carry 1. If you need to carry past the first digit, prepend 1."
  ],
  "merge-two-sorted-lists": [
    "Compare heads of both lists and pick the smaller one.",
    "Use a dummy node to simplify list construction.",
    "Iterate while both lists have nodes, always picking the smaller head. Append remaining nodes at the end."
  ],
  "maximum-subarray": [
    "Consider using Kadane's algorithm.",
    "At each position, decide: extend the current subarray or start fresh from here.",
    "Track currentSum = max(num, currentSum + num) and maxSum = max(maxSum, currentSum)."
  ],
  "length-of-last-word": [
    "Handle trailing spaces first.",
    "Work backwards from the end of the string.",
    "Skip trailing spaces, then count characters until you hit a space or the start."
  ],
  "sqrt-x": [
    "You're looking for the largest integer whose square is ≤ x.",
    "Binary search can find this efficiently.",
    "Search between 0 and x. If mid*mid ≤ x, search higher; otherwise search lower."
  ],
  "search-insert-position": [
    "This is essentially finding where a target would fit in sorted order.",
    "Use binary search.",
    "Return the index where target is found, or where it would be inserted to maintain order."
  ],
  "is-subsequence": [
    "A subsequence maintains relative order but not necessarily contiguous.",
    "Use two pointers, one for each string.",
    "Move through t; whenever characters match, advance the s pointer. Check if you reached the end of s."
  ],
  "move-zeroes": [
    "You need to move all zeroes to the end while maintaining order of non-zero elements.",
    "Use a write pointer to track where to place non-zero elements.",
    "Place all non-zero elements at the front using the write pointer, then fill the rest with zeros."
  ],
  "power-of-two": [
    "Powers of 2 in binary have only one bit set.",
    "Think about what n & (n-1) does for powers of 2.",
    "A number is a power of 2 if n > 0 and n & (n-1) == 0."
  ],
  "happy-number": [
    "Repeatedly replace the number with the sum of squares of its digits.",
    "Detect cycles to know when to stop.",
    "Use a set to track seen numbers, or use Floyd's cycle detection (slow/fast pointers)."
  ],
  "intersection-two-arrays": [
    "You need elements that appear in both arrays.",
    "Use a set for O(n) lookup.",
    "Add elements of one array to a set, then check which elements of the other array exist in the set."
  ],
  "first-unique-character": [
    "You need to find the first character that appears exactly once.",
    "Count frequency of each character first.",
    "Use a hash map to count frequencies, then iterate again to find the first character with count 1."
  ],
  "valid-anagram": [
    "Anagrams have the same characters with the same frequencies.",
    "Count character frequencies in both strings.",
    "Use a hash map or array to count. Compare the frequency maps of both strings."
  ],
  "missing-number": [
    "Numbers from 0 to n with one missing.",
    "Think about the sum formula: n*(n+1)/2.",
    "Calculate expected sum minus actual sum, or use XOR of all indices and values."
  ],
  "reverse-bits": [
    "You need to reverse the bit representation.",
    "Process bits one by one from right to left.",
    "Extract each bit using & 1, shift result left and add the bit, then shift input right."
  ],
  // New Medium Challenges
  "letter-combinations-phone": [
    "Each digit maps to 3-4 letters. You need all possible combinations.",
    "This is a backtracking/recursion problem.",
    "Use DFS: for each digit, try each letter and recurse on remaining digits."
  ],
  "generate-parentheses": [
    "Valid parentheses must always have open ≥ close at any point.",
    "Use backtracking with counts of open and close parentheses used.",
    "Add '(' if open < n, add ')' if close < open. When length reaches 2n, add to result."
  ],
  "search-rotated-sorted-array": [
    "The array is sorted but rotated. Binary search can still work.",
    "Determine which half is sorted to decide where to search.",
    "Compare mid with edges to find the sorted half. If target is in that range, search there; otherwise search the other half."
  ],
  "find-first-last-position": [
    "You need to find both boundaries of the target.",
    "Use two binary searches: one for leftmost, one for rightmost.",
    "For leftmost: when found, continue searching left. For rightmost: continue searching right."
  ],
  "combination-sum": [
    "Find all unique combinations that sum to target. Numbers can be reused.",
    "Use backtracking with a starting index to avoid duplicates.",
    "For each number, either include it (and try again with same index) or skip to next."
  ],
  "permutations": [
    "Generate all possible arrangements of the numbers.",
    "Use backtracking, tracking which elements are already used.",
    "Swap elements or maintain a 'used' array. When permutation length equals input length, record it."
  ],
  "subsets": [
    "Generate all possible subsets (power set).",
    "Each element can either be included or excluded.",
    "Use backtracking or iterative: for each element, double the existing subsets by adding the element."
  ],
  "word-break": [
    "Check if the string can be segmented into dictionary words.",
    "Use dynamic programming: dp[i] = can s[0..i) be segmented?",
    "For each position i, check all j < i: if dp[j] is true and s[j..i) is in dict, then dp[i] = true."
  ],
  "house-robber": [
    "Can't rob adjacent houses. Maximize the loot.",
    "At each house, choose to rob it or skip it.",
    "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Only need to track last two values."
  ],
  "number-of-islands": [
    "Count connected components of '1's.",
    "Use DFS or BFS to mark visited cells.",
    "For each unvisited '1', increment count and flood-fill to mark all connected '1's as visited."
  ],
  "course-schedule": [
    "Check if all courses can be finished (no circular dependencies).",
    "This is cycle detection in a directed graph.",
    "Use topological sort (Kahn's algorithm) or DFS with coloring to detect cycles."
  ],
  "kth-largest-element": [
    "Find the kth largest in unsorted array.",
    "Use a min-heap of size k, or QuickSelect algorithm.",
    "Heap: keep k largest elements, return the smallest of them. QuickSelect: partition like quicksort."
  ],
  "decode-ways": [
    "A message can be decoded in multiple ways (1=A, 26=Z).",
    "Use dynamic programming. dp[i] = number of ways to decode s[0..i).",
    "dp[i] = dp[i-1] (if s[i-1] is valid) + dp[i-2] (if s[i-2..i) forms valid 10-26)."
  ],
  "unique-paths": [
    "Count paths from top-left to bottom-right, only moving right or down.",
    "Use dynamic programming on a 2D grid.",
    "dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can optimize to 1D array."
  ],
  "jump-game": [
    "Determine if you can reach the last index.",
    "Track the furthest position reachable.",
    "Iterate through array, updating maxReach. If you can't reach current position, return false."
  ],
  "spiral-matrix": [
    "Traverse the matrix in spiral order.",
    "Maintain four boundaries: top, bottom, left, right.",
    "Move right, down, left, up while shrinking boundaries. Stop when boundaries cross."
  ],
  "set-matrix-zeroes": [
    "Set entire row and column to zero if a cell is zero.",
    "Use the first row and column as markers.",
    "Mark which rows/cols need zeroing, then apply. Use two flags for first row/col to avoid overwriting."
  ],
  "sort-colors": [
    "Sort array with only 0s, 1s, and 2s in one pass.",
    "Dutch National Flag problem - use three pointers.",
    "Low pointer for 0s, high for 2s, mid iterates. Swap based on mid's value."
  ],
  "partition-list": [
    "Partition list so nodes < x come before nodes >= x.",
    "Create two separate lists and merge them.",
    "Use two dummy heads. Append nodes to respective lists based on value, then connect them."
  ],
  // New Hard Challenges
  "n-queens": [
    "Place N queens on NxN board so no two attack each other.",
    "Queens attack same row, column, and diagonals.",
    "Use backtracking row by row. Track columns and diagonals used. Diagonals: row-col and row+col are unique."
  ],
  "sudoku-solver": [
    "Fill the 9x9 grid following Sudoku rules.",
    "Use backtracking: try each number 1-9 in empty cells.",
    "For each empty cell, try valid numbers. Use sets to track used numbers in row, column, and 3x3 box."
  ],
  "wildcard-matching": [
    "'?' matches any single character, '*' matches any sequence.",
    "Use dynamic programming: dp[i][j] = does s[0..i) match p[0..j)?",
    "Handle '*' specially: it can match empty (dp[i][j-1]) or extend match (dp[i-1][j])."
  ],
  "edit-distance": [
    "Minimum operations (insert, delete, replace) to convert word1 to word2.",
    "Classic DP problem. dp[i][j] = min ops to convert word1[0..i) to word2[0..j).",
    "If chars match, dp[i][j] = dp[i-1][j-1]. Else, min of insert, delete, replace + 1."
  ],
  "maximal-rectangle": [
    "Find largest rectangle containing only 1's in binary matrix.",
    "Build histogram heights for each row.",
    "For each row, update heights (reset to 0 on '0', increment on '1'). Apply largest rectangle in histogram."
  ],
  "palindrome-partitioning-ii": [
    "Minimum cuts to partition string into palindromes.",
    "Use DP: cuts[i] = min cuts for s[0..i].",
    "Precompute which substrings are palindromes. For each position, try all valid palindrome endings."
  ],
  "word-ladder": [
    "Transform word to another by changing one letter at a time.",
    "BFS finds shortest path. Each word is a node.",
    "Generate all words differing by one letter. Use BFS from start word, tracking visited words."
  ],
  "binary-tree-max-path-sum": [
    "Find path with maximum sum in binary tree. Path can start and end anywhere.",
    "For each node, calculate max path through it.",
    "Recursively get max path from left and right children (if positive). Update global max. Return max single path upward."
  ],
  "first-missing-positive": [
    "Find smallest missing positive integer in O(n) time, O(1) space.",
    "Use array indices as hash: place each number at its correct position.",
    "Swap nums[i] to nums[nums[i]-1] if valid. Then find first position where nums[i] != i+1."
  ],
  "longest-consecutive-sequence": [
    "Find length of longest consecutive sequence in unsorted array.",
    "Use a set for O(1) lookups.",
    "Add all numbers to set. For each number that's the start of a sequence (n-1 not in set), count consecutive numbers."
  ],
  "text-justification": [
    "Format text with full justification.",
    "Greedily pack words into lines, then justify.",
    "Calculate words per line, distribute extra spaces evenly (more on left). Last line is left-justified."
  ],
  "basic-calculator": [
    "Evaluate expression with +, -, and parentheses.",
    "Use a stack to handle parentheses.",
    "Push sign and result onto stack when seeing '('. Pop and combine when seeing ')'. Handle signs carefully."
  ],
  "count-smaller-numbers": [
    "For each element, count elements smaller than it to its right.",
    "Modified merge sort or Binary Indexed Tree.",
    "During merge sort, count inversions. Or process from right, insert into sorted structure, query position."
  ],
  "burst-balloons": [
    "Burst balloons to maximize coins. Bursting i gives nums[i-1]*nums[i]*nums[i+1] coins.",
    "Think in reverse: which balloon to burst LAST?",
    "dp[i][j] = max coins from bursting all balloons between i and j. Try each as the last to burst."
  ],
  "remove-invalid-parentheses": [
    "Remove minimum invalid parentheses to make string valid.",
    "BFS explores all possibilities level by level.",
    "BFS: try removing each '(' or ')'. First level with valid results is the answer."
  ],
  "design-twitter": [
    "Design a simplified Twitter with post, follow, unfollow, getNewsFeed.",
    "Use appropriate data structures for each operation.",
    "HashMap for user->tweets, user->followees. For news feed, merge k sorted lists (tweets from followees)."
  ]
};

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
  },
  // Additional Easy Challenges
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The parentheses match correctly."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are properly matched."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "The brackets don't match."
      }
    ],
    templates: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}

// Test your solution
console.log(isValid("()"));     // Expected: true
console.log(isValid("()[]{}"));  // Expected: true
console.log(isValid("(]"));      // Expected: false`,
      python: `def is_valid(s):
    # Write your solution here
    pass

# Test your solution
print(is_valid("()"))      # Expected: True
print(is_valid("()[]{}"))  # Expected: True
print(is_valid("(]"))      # Expected: False`,
      java: `class Solution {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isValid("()"));      // Expected: true
        System.out.println(isValid("()[]{}"));  // Expected: true
        System.out.println(isValid("(]"));      // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isValid("()") << endl;      // Expected: true
    cout << boolalpha << isValid("()[]{}") << endl;  // Expected: true
    cout << boolalpha << isValid("(]") << endl;      // Expected: false
    return 0;
}`,
      typescript: `function isValid(s: string): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isValid("()"));      // Expected: true
console.log(isValid("()[]{}"));  // Expected: true
console.log(isValid("(]"));      // Expected: false`,
    }
  },
  {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should be stored inside nums1.",
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "The arrays are merged and sorted in nums1."
      }
    ],
    templates: {
      javascript: `function merge(nums1, m, nums2, n) {
  // Write your solution here - modify nums1 in-place
  
}

// Test your solution
const nums1 = [1,2,3,0,0,0];
merge(nums1, 3, [2,5,6], 3);
console.log(nums1); // Expected: [1,2,2,3,5,6]`,
      python: `def merge(nums1, m, nums2, n):
    # Write your solution here - modify nums1 in-place
    pass

# Test your solution
nums1 = [1,2,3,0,0,0]
merge(nums1, 3, [2,5,6], 3)
print(nums1)  # Expected: [1,2,2,3,5,6]`,
      java: `import java.util.Arrays;

class Solution {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution here - modify nums1 in-place
    }
    
    public static void main(String[] args) {
        int[] nums1 = {1,2,3,0,0,0};
        merge(nums1, 3, new int[]{2,5,6}, 3);
        System.out.println(Arrays.toString(nums1)); // Expected: [1,2,2,3,5,6]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    // Write your solution here - modify nums1 in-place
}

int main() {
    vector<int> nums1 = {1,2,3,0,0,0};
    vector<int> nums2 = {2,5,6};
    merge(nums1, 3, nums2, 3);
    for (int n : nums1) cout << n << " ";
    cout << endl; // Expected: 1 2 2 3 5 6
    return 0;
}`,
      typescript: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // Write your solution here - modify nums1 in-place
  
}

// Test your solution
const nums1 = [1,2,3,0,0,0];
merge(nums1, 3, [2,5,6], 3);
console.log(nums1); // Expected: [1,2,2,3,5,6]`,
    }
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No transaction is done, max profit = 0."
      }
    ],
    templates: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
  
}

// Test your solution
console.log(maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log(maxProfit([7,6,4,3,1]));   // Expected: 0`,
      python: `def max_profit(prices):
    # Write your solution here
    pass

# Test your solution
print(max_profit([7,1,5,3,6,4]))  # Expected: 5
print(max_profit([7,6,4,3,1]))    # Expected: 0`,
      java: `class Solution {
    public static int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7,1,5,3,6,4})); // Expected: 5
        System.out.println(maxProfit(new int[]{7,6,4,3,1}));   // Expected: 0
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> p1 = {7,1,5,3,6,4};
    vector<int> p2 = {7,6,4,3,1};
    cout << maxProfit(p1) << endl; // Expected: 5
    cout << maxProfit(p2) << endl; // Expected: 0
    return 0;
}`,
      typescript: `function maxProfit(prices: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log(maxProfit([7,6,4,3,1]));   // Expected: 0`,
    }
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways: 1+1 or 2."
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways: 1+1+1, 1+2, or 2+1."
      }
    ],
    templates: {
      javascript: `function climbStairs(n) {
  // Write your solution here
  
}

// Test your solution
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3
console.log(climbStairs(5)); // Expected: 8`,
      python: `def climb_stairs(n):
    # Write your solution here
    pass

# Test your solution
print(climb_stairs(2))  # Expected: 2
print(climb_stairs(3))  # Expected: 3
print(climb_stairs(5))  # Expected: 8`,
      java: `class Solution {
    public static int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(climbStairs(2)); // Expected: 2
        System.out.println(climbStairs(3)); // Expected: 3
        System.out.println(climbStairs(5)); // Expected: 8
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // Write your solution here
    return 0;
}

int main() {
    cout << climbStairs(2) << endl; // Expected: 2
    cout << climbStairs(3) << endl; // Expected: 3
    cout << climbStairs(5) << endl; // Expected: 8
    return 0;
}`,
      typescript: `function climbStairs(n: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3
console.log(climbStairs(5)); // Expected: 8`,
    }
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "1 appears twice."
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct."
      }
    ],
    templates: {
      javascript: `function containsDuplicate(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(containsDuplicate([1,2,3,1])); // Expected: true
console.log(containsDuplicate([1,2,3,4])); // Expected: false`,
      python: `def contains_duplicate(nums):
    # Write your solution here
    pass

# Test your solution
print(contains_duplicate([1,2,3,1]))  # Expected: True
print(contains_duplicate([1,2,3,4]))  # Expected: False`,
      java: `class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1,2,3,1})); // Expected: true
        System.out.println(containsDuplicate(new int[]{1,2,3,4})); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // Write your solution here
    return false;
}

int main() {
    vector<int> n1 = {1,2,3,1};
    vector<int> n2 = {1,2,3,4};
    cout << boolalpha << containsDuplicate(n1) << endl; // Expected: true
    cout << boolalpha << containsDuplicate(n2) << endl; // Expected: false
    return 0;
}`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(containsDuplicate([1,2,3,1])); // Expected: true
console.log(containsDuplicate([1,2,3,4])); // Expected: false`,
    }
  },
  {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with O(n) runtime complexity and O(1) extra space.",
    examples: [
      {
        input: "nums = [2,2,1]",
        output: "1",
        explanation: "1 appears once while 2 appears twice."
      },
      {
        input: "nums = [4,1,2,1,2]",
        output: "4",
        explanation: "4 appears once."
      }
    ],
    templates: {
      javascript: `function singleNumber(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(singleNumber([2,2,1]));     // Expected: 1
console.log(singleNumber([4,1,2,1,2])); // Expected: 4`,
      python: `def single_number(nums):
    # Write your solution here
    pass

# Test your solution
print(single_number([2,2,1]))      # Expected: 1
print(single_number([4,1,2,1,2]))  # Expected: 4`,
      java: `class Solution {
    public static int singleNumber(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{2,2,1}));     // Expected: 1
        System.out.println(singleNumber(new int[]{4,1,2,1,2})); // Expected: 4
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> n1 = {2,2,1};
    vector<int> n2 = {4,1,2,1,2};
    cout << singleNumber(n1) << endl; // Expected: 1
    cout << singleNumber(n2) << endl; // Expected: 4
    return 0;
}`,
      typescript: `function singleNumber(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(singleNumber([2,2,1]));     // Expected: 1
console.log(singleNumber([4,1,2,1,2])); // Expected: 4`,
    }
  },
  // Additional Medium Challenges
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The distinct triplets that sum to zero."
      }
    ],
    templates: {
      javascript: `function threeSum(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(threeSum([-1,0,1,2,-1,-4])); // Expected: [[-1,-1,2],[-1,0,1]]`,
      python: `def three_sum(nums):
    # Write your solution here
    pass

# Test your solution
print(three_sum([-1,0,1,2,-1,-4]))  # Expected: [[-1,-1,2],[-1,0,1]]`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1,0,1,2,-1,-4}));
        // Expected: [[-1,-1,2],[-1,0,1]]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {-1,0,1,2,-1,-4};
    auto result = threeSum(nums);
    for (auto& triplet : result) {
        cout << "[" << triplet[0] << "," << triplet[1] << "," << triplet[2] << "] ";
    }
    cout << endl; // Expected: [-1,-1,2] [-1,0,1]
    return 0;
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(threeSum([-1,0,1,2,-1,-4])); // Expected: [[-1,-1,2],[-1,0,1]]`,
    }
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Group words that are anagrams of each other."
      }
    ],
    templates: {
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
  
}

// Test your solution
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]`,
      python: `def group_anagrams(strs):
    # Write your solution here
    pass

# Test your solution
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]`,
      java: `import java.util.*;

class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"}));
        // Expected: [[bat],[nat,tan],[ate,eat,tea]]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Write your solution here
    return {};
}

int main() {
    vector<string> strs = {"eat","tea","tan","ate","nat","bat"};
    auto result = groupAnagrams(strs);
    for (auto& group : result) {
        cout << "[";
        for (auto& s : group) cout << s << " ";
        cout << "] ";
    }
    cout << endl;
    return 0;
}`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]`,
    }
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "24=2*3*4, 12=1*3*4, 8=1*2*4, 6=1*2*3"
      }
    ],
    templates: {
      javascript: `function productExceptSelf(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(productExceptSelf([1,2,3,4]));   // Expected: [24,12,8,6]
console.log(productExceptSelf([-1,1,0,-3,3])); // Expected: [0,0,9,0,0]`,
      python: `def product_except_self(nums):
    # Write your solution here
    pass

# Test your solution
print(product_except_self([1,2,3,4]))     # Expected: [24,12,8,6]
print(product_except_self([-1,1,0,-3,3])) # Expected: [0,0,9,0,0]`,
      java: `import java.util.Arrays;

class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4})));
        // Expected: [24,12,8,6]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> productExceptSelf(vector<int>& nums) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {1,2,3,4};
    auto result = productExceptSelf(nums);
    for (int n : result) cout << n << " ";
    cout << endl; // Expected: 24 12 8 6
    return 0;
}`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(productExceptSelf([1,2,3,4])); // Expected: [24,12,8,6]`,
    }
  },
  {
    id: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees clockwise. You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
        explanation: "The matrix is rotated 90 degrees clockwise."
      }
    ],
    templates: {
      javascript: `function rotate(matrix) {
  // Write your solution here - modify matrix in-place
  
}

// Test your solution
const matrix = [[1,2,3],[4,5,6],[7,8,9]];
rotate(matrix);
console.log(matrix); // Expected: [[7,4,1],[8,5,2],[9,6,3]]`,
      python: `def rotate(matrix):
    # Write your solution here - modify matrix in-place
    pass

# Test your solution
matrix = [[1,2,3],[4,5,6],[7,8,9]]
rotate(matrix)
print(matrix)  # Expected: [[7,4,1],[8,5,2],[9,6,3]]`,
      java: `import java.util.Arrays;

class Solution {
    public static void rotate(int[][] matrix) {
        // Write your solution here - modify matrix in-place
    }
    
    public static void main(String[] args) {
        int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};
        rotate(matrix);
        for (int[] row : matrix) {
            System.out.println(Arrays.toString(row));
        } // Expected: [7,4,1] [8,5,2] [9,6,3]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    // Write your solution here - modify matrix in-place
}

int main() {
    vector<vector<int>> matrix = {{1,2,3},{4,5,6},{7,8,9}};
    rotate(matrix);
    for (auto& row : matrix) {
        for (int n : row) cout << n << " ";
        cout << endl;
    } // Expected: 7 4 1 / 8 5 2 / 9 6 3
    return 0;
}`,
      typescript: `function rotate(matrix: number[][]): void {
  // Write your solution here - modify matrix in-place
  
}

// Test your solution
const matrix = [[1,2,3],[4,5,6],[7,8,9]];
rotate(matrix);
console.log(matrix); // Expected: [[7,4,1],[8,5,2],[9,6,3]]`,
    }
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1"
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot make 3 with only coin of 2."
      }
    ],
    templates: {
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
  
}

// Test your solution
console.log(coinChange([1,2,5], 11)); // Expected: 3
console.log(coinChange([2], 3));      // Expected: -1`,
      python: `def coin_change(coins, amount):
    # Write your solution here
    pass

# Test your solution
print(coin_change([1,2,5], 11))  # Expected: 3
print(coin_change([2], 3))       # Expected: -1`,
      java: `class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1,2,5}, 11)); // Expected: 3
        System.out.println(coinChange(new int[]{2}, 3));      // Expected: -1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> coins1 = {1,2,5};
    vector<int> coins2 = {2};
    cout << coinChange(coins1, 11) << endl; // Expected: 3
    cout << coinChange(coins2, 3) << endl;  // Expected: -1
    return 0;
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(coinChange([1,2,5], 11)); // Expected: 3
console.log(coinChange([2], 3));      // Expected: -1`,
    }
  },
  {
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree contains only nodes with keys greater than the node's key. Both subtrees must also be BSTs.",
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "Valid BST with 2 as root, 1 as left child, 3 as right child."
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "Node 4 is in right subtree but has value less than 5."
      }
    ],
    templates: {
      javascript: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isValidBST(root) {
  // Write your solution here
  
}

// Test your solution
const tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log(isValidBST(tree1)); // Expected: true

const tree2 = new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)));
console.log(isValidBST(tree2)); // Expected: false`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root):
    # Write your solution here
    pass

# Test your solution
tree1 = TreeNode(2, TreeNode(1), TreeNode(3))
print(is_valid_bst(tree1))  # Expected: True

tree2 = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
print(is_valid_bst(tree2))  # Expected: False`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public static boolean isValidBST(TreeNode root) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        TreeNode tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        System.out.println(isValidBST(tree1)); // Expected: true
    }
}`,
      cpp: `#include <iostream>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};

bool isValidBST(TreeNode* root) {
    // Write your solution here
    return false;
}

int main() {
    TreeNode* tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    cout << boolalpha << isValidBST(tree1) << endl; // Expected: true
    return 0;
}`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isValidBST(root: TreeNode | null): boolean {
  // Write your solution here
  return false;
}

// Test your solution
const tree1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
console.log(isValidBST(tree1)); // Expected: true`,
    }
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) Initialize the cache with positive size capacity. int get(int key) Return the value if the key exists, otherwise return -1. void put(int key, int value) Update or insert. When capacity is reached, evict the least recently used key.",
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"] [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: "[null,null,null,1,null,-1,null,-1,3,4]",
        explanation: "Operations on LRU cache with capacity 2."
      }
    ],
    templates: {
      javascript: `class LRUCache {
  constructor(capacity) {
    // Initialize your data structure
  }
  
  get(key) {
    // Return value if exists, -1 otherwise
  }
  
  put(key, value) {
    // Update or insert, evict LRU if needed
  }
}

// Test your solution
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // Expected: 1
cache.put(3, 3);
console.log(cache.get(2)); // Expected: -1 (evicted)
cache.put(4, 4);
console.log(cache.get(1)); // Expected: -1 (evicted)
console.log(cache.get(3)); // Expected: 3
console.log(cache.get(4)); // Expected: 4`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your data structure
        pass
    
    def get(self, key: int) -> int:
        # Return value if exists, -1 otherwise
        pass
    
    def put(self, key: int, value: int) -> None:
        # Update or insert, evict LRU if needed
        pass

# Test your solution
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1))  # Expected: 1
cache.put(3, 3)
print(cache.get(2))  # Expected: -1 (evicted)`,
      java: `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
        // Initialize your data structure
    }
    
    public int get(int key) {
        // Return value if exists, -1 otherwise
        return -1;
    }
    
    public void put(int key, int value) {
        // Update or insert, evict LRU if needed
    }
    
    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(2, 2);
        System.out.println(cache.get(1)); // Expected: 1
        cache.put(3, 3);
        System.out.println(cache.get(2)); // Expected: -1
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        // Initialize your data structure
    }
    
    int get(int key) {
        // Return value if exists, -1 otherwise
        return -1;
    }
    
    void put(int key, int value) {
        // Update or insert, evict LRU if needed
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cout << cache.get(1) << endl; // Expected: 1
    cache.put(3, 3);
    cout << cache.get(2) << endl; // Expected: -1
    return 0;
}`,
      typescript: `class LRUCache {
  constructor(capacity: number) {
    // Initialize your data structure
  }
  
  get(key: number): number {
    // Return value if exists, -1 otherwise
    return -1;
  }
  
  put(key: number, value: number): void {
    // Update or insert, evict LRU if needed
  }
}

// Test your solution
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // Expected: 1`,
    }
  },
  // Additional Hard Challenges
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "All three lists merged and sorted."
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

// Helper to create list
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
const lists = [createList([1,4,5]), createList([1,3,4]), createList([2,6])];
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

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for n in arr:
        curr.next = ListNode(n)
        curr = curr.next
    return dummy.next

# Test your solution
lists = [create_list([1,4,5]), create_list([1,3,4]), create_list([2,6])]
result = merge_k_lists(lists)
output = []
while result:
    output.append(result.val)
    result = result.next
print(output)  # Expected: [1,1,2,3,4,4,5,6]`,
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
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int n : arr) {
            curr.next = new ListNode(n);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static void main(String[] args) {
        ListNode[] lists = {
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
#include <queue>
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
    ListNode dummy(0);
    ListNode* curr = &dummy;
    for (int n : arr) {
        curr->next = new ListNode(n);
        curr = curr->next;
    }
    return dummy.next;
}

int main() {
    vector<int> a1 = {1,4,5}, a2 = {1,3,4}, a3 = {2,6};
    vector<ListNode*> lists = {createList(a1), createList(a2), createList(a3)};
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

// Test your solution
function createList(arr: number[]): ListNode | null {
  let dummy = new ListNode();
  let curr = dummy;
  for (let n of arr) {
    curr.next = new ListNode(n);
    curr = curr.next;
  }
  return dummy.next;
}

const lists = [createList([1,4,5]), createList([1,3,4]), createList([2,6])];
let result = mergeKLists(lists);
let output: number[] = [];
while (result) { output.push(result.val); result = result.next; }
console.log(output); // Expected: [1,1,2,3,4,4,5,6]`,
    }
  },
  {
    id: "word-search-ii",
    title: "Word Search II",
    difficulty: "Hard",
    description: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
    examples: [
      {
        input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
        output: '["eat","oath"]',
        explanation: "These words can be found on the board."
      }
    ],
    templates: {
      javascript: `function findWords(board, words) {
  // Write your solution here
  
}

// Test your solution
const board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];
console.log(findWords(board, ["oath","pea","eat","rain"]));
// Expected: ["eat","oath"]`,
      python: `def find_words(board, words):
    # Write your solution here
    pass

# Test your solution
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
print(find_words(board, ["oath","pea","eat","rain"]))
# Expected: ["eat","oath"]`,
      java: `import java.util.*;

class Solution {
    public static List<String> findWords(char[][] board, String[] words) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        char[][] board = {{'o','a','a','n'},{'e','t','a','e'},{'i','h','k','r'},{'i','f','l','v'}};
        System.out.println(findWords(board, new String[]{"oath","pea","eat","rain"}));
        // Expected: [eat, oath]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    // Write your solution here
    return {};
}

int main() {
    vector<vector<char>> board = {{'o','a','a','n'},{'e','t','a','e'},{'i','h','k','r'},{'i','f','l','v'}};
    vector<string> words = {"oath","pea","eat","rain"};
    auto result = findWords(board, words);
    for (auto& w : result) cout << w << " ";
    cout << endl; // Expected: eat oath
    return 0;
}`,
      typescript: `function findWords(board: string[][], words: string[]): string[] {
  // Write your solution here
  return [];
}

// Test your solution
const board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];
console.log(findWords(board, ["oath","pea","eat","rain"]));
// Expected: ["eat","oath"]`,
    }
  },
  {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: "false",
        explanation: "'a' does not match the entire string 'aa'."
      },
      {
        input: 's = "aa", p = "a*"',
        output: "true",
        explanation: "'*' means zero or more of 'a'. 'a*' matches 'aa'."
      }
    ],
    templates: {
      javascript: `function isMatch(s, p) {
  // Write your solution here
  
}

// Test your solution
console.log(isMatch("aa", "a"));   // Expected: false
console.log(isMatch("aa", "a*"));  // Expected: true
console.log(isMatch("ab", ".*")); // Expected: true`,
      python: `def is_match(s, p):
    # Write your solution here
    pass

# Test your solution
print(is_match("aa", "a"))   # Expected: False
print(is_match("aa", "a*"))  # Expected: True
print(is_match("ab", ".*")) # Expected: True`,
      java: `class Solution {
    public static boolean isMatch(String s, String p) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isMatch("aa", "a"));   // Expected: false
        System.out.println(isMatch("aa", "a*"));  // Expected: true
        System.out.println(isMatch("ab", ".*")); // Expected: true
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isMatch(string s, string p) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isMatch("aa", "a") << endl;   // Expected: false
    cout << boolalpha << isMatch("aa", "a*") << endl;  // Expected: true
    cout << boolalpha << isMatch("ab", ".*") << endl; // Expected: true
    return 0;
}`,
      typescript: `function isMatch(s: string, p: string): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isMatch("aa", "a"));   // Expected: false
console.log(isMatch("aa", "a*"));  // Expected: true
console.log(isMatch("ab", ".*")); // Expected: true`,
    }
  },
  {
    id: "serialize-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description: "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "Serialize tree to string and deserialize back to same tree."
      }
    ],
    templates: {
      javascript: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serialize(root) {
  // Write your solution here
  
}

function deserialize(data) {
  // Write your solution here
  
}

// Test your solution
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
const serialized = serialize(root);
console.log(serialized);
const deserialized = deserialize(serialized);
console.log(serialize(deserialized) === serialized); // Expected: true`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def serialize(root):
    # Write your solution here
    pass

def deserialize(data):
    # Write your solution here
    pass

# Test your solution
root = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4), TreeNode(5)))
serialized = serialize(root)
print(serialized)
deserialized = deserialize(serialized)
print(serialize(deserialized) == serialized)  # Expected: True`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Codec {
    public String serialize(TreeNode root) {
        // Write your solution here
        return "";
    }
    
    public TreeNode deserialize(String data) {
        // Write your solution here
        return null;
    }
    
    public static void main(String[] args) {
        Codec codec = new Codec();
        TreeNode root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
        String serialized = codec.serialize(root);
        System.out.println(serialized);
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};

string serialize(TreeNode* root) {
    // Write your solution here
    return "";
}

TreeNode* deserialize(string data) {
    // Write your solution here
    return nullptr;
}

int main() {
    TreeNode* root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
    string serialized = serialize(root);
    cout << serialized << endl;
    return 0;
}`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serialize(root: TreeNode | null): string {
  // Write your solution here
  return "";
}

function deserialize(data: string): TreeNode | null {
  // Write your solution here
  return null;
}

// Test your solution
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
const serialized = serialize(root);
console.log(serialized);`,
    }
  },
  {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    description: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    examples: [
      {
        input: 's = "(()"',
        output: "2",
        explanation: "The longest valid parentheses substring is '()'."
      },
      {
        input: 's = ")()())"',
        output: "4",
        explanation: "The longest valid parentheses substring is '()()'."
      }
    ],
    templates: {
      javascript: `function longestValidParentheses(s) {
  // Write your solution here
  
}

// Test your solution
console.log(longestValidParentheses("(()")); // Expected: 2
console.log(longestValidParentheses(")()())")); // Expected: 4`,
      python: `def longest_valid_parentheses(s):
    # Write your solution here
    pass

# Test your solution
print(longest_valid_parentheses("(()"))    # Expected: 2
print(longest_valid_parentheses(")()())")) # Expected: 4`,
      java: `class Solution {
    public static int longestValidParentheses(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(longestValidParentheses("(()")); // Expected: 2
        System.out.println(longestValidParentheses(")()())")); // Expected: 4
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int longestValidParentheses(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << longestValidParentheses("(()") << endl;    // Expected: 2
    cout << longestValidParentheses(")()())") << endl; // Expected: 4
    return 0;
}`,
      typescript: `function longestValidParentheses(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(longestValidParentheses("(()")); // Expected: 2
console.log(longestValidParentheses(")()())")); // Expected: 4`,
    }
  },
  {
    id: "alien-dictionary",
    title: "Alien Dictionary",
    difficulty: "Hard",
    description: "There is a new alien language that uses the English alphabet. However, the order of the letters is unknown. You are given a list of strings words from the alien language's dictionary, sorted lexicographically by the rules of this new language. Return a string of the unique letters sorted in lexicographically increasing order by the new language's rules.",
    examples: [
      {
        input: 'words = ["wrt","wrf","er","ett","rftt"]',
        output: '"wertf"',
        explanation: "The order is: w -> e -> r -> t -> f"
      }
    ],
    templates: {
      javascript: `function alienOrder(words) {
  // Write your solution here
  
}

// Test your solution
console.log(alienOrder(["wrt","wrf","er","ett","rftt"])); // Expected: "wertf"
console.log(alienOrder(["z","x"])); // Expected: "zx"`,
      python: `def alien_order(words):
    # Write your solution here
    pass

# Test your solution
print(alien_order(["wrt","wrf","er","ett","rftt"]))  # Expected: "wertf"
print(alien_order(["z","x"]))  # Expected: "zx"`,
      java: `import java.util.*;

class Solution {
    public static String alienOrder(String[] words) {
        // Write your solution here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(alienOrder(new String[]{"wrt","wrf","er","ett","rftt"}));
        // Expected: wertf
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

string alienOrder(vector<string>& words) {
    // Write your solution here
    return "";
}

int main() {
    vector<string> words = {"wrt","wrf","er","ett","rftt"};
    cout << alienOrder(words) << endl; // Expected: wertf
    return 0;
}`,
      typescript: `function alienOrder(words: string[]): string {
  // Write your solution here
  return "";
}

// Test your solution
console.log(alienOrder(["wrt","wrf","er","ett","rftt"])); // Expected: "wertf"`,
    }
  },
  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string ''.",
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: "The minimum window substring 'BANC' includes 'A', 'B', and 'C'."
      }
    ],
    templates: {
      javascript: `function minWindow(s, t) {
  // Write your solution here
  
}

// Test your solution
console.log(minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log(minWindow("a", "a")); // Expected: "a"
console.log(minWindow("a", "aa")); // Expected: ""`,
      python: `def min_window(s, t):
    # Write your solution here
    pass

# Test your solution
print(min_window("ADOBECODEBANC", "ABC"))  # Expected: "BANC"
print(min_window("a", "a"))  # Expected: "a"
print(min_window("a", "aa")) # Expected: ""`,
      java: `import java.util.*;

class Solution {
    public static String minWindow(String s, String t) {
        // Write your solution here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // Expected: BANC
        System.out.println(minWindow("a", "a")); // Expected: a
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

string minWindow(string s, string t) {
    // Write your solution here
    return "";
}

int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl; // Expected: BANC
    cout << minWindow("a", "a") << endl; // Expected: a
    return 0;
}`,
      typescript: `function minWindow(s: string, t: string): string {
  // Write your solution here
  return "";
}

// Test your solution
console.log(minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"`,
    }
  },
  
  // ============================================================
  // NEW EASY CHALLENGES (17 more)
  // ============================================================
  {
    id: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    description: "Given a roman numeral, convert it to an integer. Roman numerals are represented by: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtraction is used when a smaller value precedes a larger one (e.g., IV=4).",
    examples: [
      { input: 's = "III"', output: "3", explanation: "III = 3" },
      { input: 's = "LVIII"', output: "58", explanation: "L = 50, V= 5, III = 3" },
      { input: 's = "MCMXCIV"', output: "1994", explanation: "M = 1000, CM = 900, XC = 90, IV = 4" }
    ],
    templates: {
      javascript: `function romanToInt(s) {
  // Write your solution here
  
}

// Test your solution
console.log(romanToInt("III"));     // Expected: 3
console.log(romanToInt("LVIII"));   // Expected: 58
console.log(romanToInt("MCMXCIV")); // Expected: 1994`,
      python: `def roman_to_int(s):
    # Write your solution here
    pass

# Test your solution
print(roman_to_int("III"))      # Expected: 3
print(roman_to_int("MCMXCIV"))  # Expected: 1994`,
      java: `class Solution {
    public static int romanToInt(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(romanToInt("III"));     // Expected: 3
        System.out.println(romanToInt("MCMXCIV")); // Expected: 1994
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int romanToInt(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << romanToInt("III") << endl;     // Expected: 3
    cout << romanToInt("MCMXCIV") << endl; // Expected: 1994
    return 0;
}`,
      typescript: `function romanToInt(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(romanToInt("III"));     // Expected: 3
console.log(romanToInt("MCMXCIV")); // Expected: 1994`,
    }
  },
  {
    id: "remove-duplicates-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]", explanation: "Return 2, with the first two elements being 1 and 2." },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]", explanation: "Return 5." }
    ],
    templates: {
      javascript: `function removeDuplicates(nums) {
  // Write your solution here
  
}

// Test your solution
const nums = [1,1,2];
console.log(removeDuplicates(nums)); // Expected: 2
console.log(nums.slice(0, 2));       // Expected: [1, 2]`,
      python: `def remove_duplicates(nums):
    # Write your solution here
    pass

# Test your solution
nums = [1,1,2]
print(remove_duplicates(nums))  # Expected: 2
print(nums[:2])                 # Expected: [1, 2]`,
      java: `class Solution {
    public static int removeDuplicates(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        int[] nums = {1,1,2};
        System.out.println(removeDuplicates(nums)); // Expected: 2
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int removeDuplicates(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {1,1,2};
    cout << removeDuplicates(nums) << endl; // Expected: 2
    return 0;
}`,
      typescript: `function removeDuplicates(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
const nums = [1,1,2];
console.log(removeDuplicates(nums)); // Expected: 2`,
    }
  },
  {
    id: "plus-one",
    title: "Plus One",
    difficulty: "Easy",
    description: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    examples: [
      { input: "digits = [1,2,3]", output: "[1,2,4]", explanation: "The array represents the integer 123. Incrementing by one gives 124." },
      { input: "digits = [9,9,9]", output: "[1,0,0,0]", explanation: "999 + 1 = 1000" }
    ],
    templates: {
      javascript: `function plusOne(digits) {
  // Write your solution here
  
}

// Test your solution
console.log(plusOne([1,2,3])); // Expected: [1,2,4]
console.log(plusOne([9,9,9])); // Expected: [1,0,0,0]`,
      python: `def plus_one(digits):
    # Write your solution here
    pass

# Test your solution
print(plus_one([1,2,3]))  # Expected: [1,2,4]
print(plus_one([9,9,9]))  # Expected: [1,0,0,0]`,
      java: `import java.util.Arrays;

class Solution {
    public static int[] plusOne(int[] digits) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(plusOne(new int[]{1,2,3}))); // Expected: [1,2,4]
        System.out.println(Arrays.toString(plusOne(new int[]{9,9,9}))); // Expected: [1,0,0,0]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> plusOne(vector<int>& digits) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> digits = {1,2,3};
    vector<int> result = plusOne(digits);
    for (int d : result) cout << d << " ";
    cout << endl; // Expected: 1 2 4
    return 0;
}`,
      typescript: `function plusOne(digits: number[]): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(plusOne([1,2,3])); // Expected: [1,2,4]
console.log(plusOne([9,9,9])); // Expected: [1,0,0,0]`,
    }
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged in sorted order." }
    ],
    templates: {
      javascript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeTwoLists(list1, list2) {
  // Write your solution here
  
}

// Test helper
function arrayToList(arr) {
  let dummy = new ListNode();
  let curr = dummy;
  for (let val of arr) {
    curr.next = new ListNode(val);
    curr = curr.next;
  }
  return dummy.next;
}

function listToArray(head) {
  let result = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

console.log(listToArray(mergeTwoLists(arrayToList([1,2,4]), arrayToList([1,3,4])))); 
// Expected: [1,1,2,3,4,4]`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Write your solution here
    pass

# Test helper
def array_to_list(arr):
    dummy = ListNode()
    curr = dummy
    for val in arr:
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next

def list_to_array(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

print(list_to_array(merge_two_lists(array_to_list([1,2,4]), array_to_list([1,3,4]))))
# Expected: [1,1,2,3,4,4]`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        return null;
    }
    
    public static void main(String[] args) {
        // Test with your implementation
        System.out.println("Implement and test");
    }
}`,
      cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your solution here
    return nullptr;
}

int main() {
    // Test with your implementation
    cout << "Implement and test" << endl;
    return 0;
}`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Write your solution here
  return null;
}

// Test your solution
console.log("Implement and test");`,
    }
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Easy",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "Subarray [1] has sum 1." }
    ],
    templates: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1]));                      // Expected: 1`,
      python: `def max_sub_array(nums):
    # Write your solution here
    pass

# Test your solution
print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(max_sub_array([1]))                       # Expected: 1`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums) << endl; // Expected: 6
    return 0;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6`,
    }
  },
  {
    id: "length-of-last-word",
    title: "Length of Last Word",
    difficulty: "Easy",
    description: "Given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.",
    examples: [
      { input: 's = "Hello World"', output: "5", explanation: 'The last word is "World" with length 5.' },
      { input: 's = "   fly me   to   the moon  "', output: "4", explanation: 'The last word is "moon" with length 4.' }
    ],
    templates: {
      javascript: `function lengthOfLastWord(s) {
  // Write your solution here
  
}

// Test your solution
console.log(lengthOfLastWord("Hello World"));           // Expected: 5
console.log(lengthOfLastWord("   fly me   to   the moon  ")); // Expected: 4`,
      python: `def length_of_last_word(s):
    # Write your solution here
    pass

# Test your solution
print(length_of_last_word("Hello World"))  # Expected: 5
print(length_of_last_word("   fly me   to   the moon  "))  # Expected: 4`,
      java: `class Solution {
    public static int lengthOfLastWord(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLastWord("Hello World")); // Expected: 5
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int lengthOfLastWord(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << lengthOfLastWord("Hello World") << endl; // Expected: 5
    return 0;
}`,
      typescript: `function lengthOfLastWord(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(lengthOfLastWord("Hello World")); // Expected: 5`,
    }
  },
  {
    id: "sqrt-x",
    title: "Sqrt(x)",
    difficulty: "Easy",
    description: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer. You must not use any built-in exponent function or operator.",
    examples: [
      { input: "x = 4", output: "2", explanation: "sqrt(4) = 2" },
      { input: "x = 8", output: "2", explanation: "sqrt(8) = 2.82842..., rounded down to 2" }
    ],
    templates: {
      javascript: `function mySqrt(x) {
  // Write your solution here
  
}

// Test your solution
console.log(mySqrt(4)); // Expected: 2
console.log(mySqrt(8)); // Expected: 2`,
      python: `def my_sqrt(x):
    # Write your solution here
    pass

# Test your solution
print(my_sqrt(4))  # Expected: 2
print(my_sqrt(8))  # Expected: 2`,
      java: `class Solution {
    public static int mySqrt(int x) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(mySqrt(4)); // Expected: 2
        System.out.println(mySqrt(8)); // Expected: 2
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int mySqrt(int x) {
    // Write your solution here
    return 0;
}

int main() {
    cout << mySqrt(4) << endl; // Expected: 2
    cout << mySqrt(8) << endl; // Expected: 2
    return 0;
}`,
      typescript: `function mySqrt(x: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(mySqrt(4)); // Expected: 2
console.log(mySqrt(8)); // Expected: 2`,
    }
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "Easy",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2", explanation: "5 is found at index 2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1", explanation: "2 would be inserted at index 1" }
    ],
    templates: {
      javascript: `function searchInsert(nums, target) {
  // Write your solution here
  
}

// Test your solution
console.log(searchInsert([1,3,5,6], 5)); // Expected: 2
console.log(searchInsert([1,3,5,6], 2)); // Expected: 1`,
      python: `def search_insert(nums, target):
    # Write your solution here
    pass

# Test your solution
print(search_insert([1,3,5,6], 5))  # Expected: 2
print(search_insert([1,3,5,6], 2))  # Expected: 1`,
      java: `class Solution {
    public static int searchInsert(int[] nums, int target) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(searchInsert(new int[]{1,3,5,6}, 5)); // Expected: 2
        System.out.println(searchInsert(new int[]{1,3,5,6}, 2)); // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int searchInsert(vector<int>& nums, int target) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {1,3,5,6};
    cout << searchInsert(nums, 5) << endl; // Expected: 2
    cout << searchInsert(nums, 2) << endl; // Expected: 1
    return 0;
}`,
      typescript: `function searchInsert(nums: number[], target: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(searchInsert([1,3,5,6], 5)); // Expected: 2
console.log(searchInsert([1,3,5,6], 2)); // Expected: 1`,
    }
  },
  {
    id: "is-subsequence",
    title: "Is Subsequence",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if s is a subsequence of t, or false otherwise. A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.",
    examples: [
      { input: 's = "abc", t = "ahbgdc"', output: "true", explanation: "a, b, c appear in order in t" },
      { input: 's = "axc", t = "ahbgdc"', output: "false", explanation: "x is not in t" }
    ],
    templates: {
      javascript: `function isSubsequence(s, t) {
  // Write your solution here
  
}

// Test your solution
console.log(isSubsequence("abc", "ahbgdc")); // Expected: true
console.log(isSubsequence("axc", "ahbgdc")); // Expected: false`,
      python: `def is_subsequence(s, t):
    # Write your solution here
    pass

# Test your solution
print(is_subsequence("abc", "ahbgdc"))  # Expected: True
print(is_subsequence("axc", "ahbgdc"))  # Expected: False`,
      java: `class Solution {
    public static boolean isSubsequence(String s, String t) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isSubsequence("abc", "ahbgdc")); // Expected: true
        System.out.println(isSubsequence("axc", "ahbgdc")); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isSubsequence(string s, string t) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isSubsequence("abc", "ahbgdc") << endl; // Expected: true
    cout << boolalpha << isSubsequence("axc", "ahbgdc") << endl; // Expected: false
    return 0;
}`,
      typescript: `function isSubsequence(s: string, t: string): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isSubsequence("abc", "ahbgdc")); // Expected: true
console.log(isSubsequence("axc", "ahbgdc")); // Expected: false`,
    }
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "Non-zero elements maintain order, zeros moved to end" }
    ],
    templates: {
      javascript: `function moveZeroes(nums) {
  // Write your solution here - modify in-place
  
}

// Test your solution
const nums = [0,1,0,3,12];
moveZeroes(nums);
console.log(nums); // Expected: [1,3,12,0,0]`,
      python: `def move_zeroes(nums):
    # Write your solution here - modify in-place
    pass

# Test your solution
nums = [0,1,0,3,12]
move_zeroes(nums)
print(nums)  # Expected: [1,3,12,0,0]`,
      java: `import java.util.Arrays;

class Solution {
    public static void moveZeroes(int[] nums) {
        // Write your solution here - modify in-place
    }
    
    public static void main(String[] args) {
        int[] nums = {0,1,0,3,12};
        moveZeroes(nums);
        System.out.println(Arrays.toString(nums)); // Expected: [1,3,12,0,0]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void moveZeroes(vector<int>& nums) {
    // Write your solution here - modify in-place
}

int main() {
    vector<int> nums = {0,1,0,3,12};
    moveZeroes(nums);
    for (int n : nums) cout << n << " ";
    cout << endl; // Expected: 1 3 12 0 0
    return 0;
}`,
      typescript: `function moveZeroes(nums: number[]): void {
  // Write your solution here - modify in-place
  
}

// Test your solution
const nums = [0,1,0,3,12];
moveZeroes(nums);
console.log(nums); // Expected: [1,3,12,0,0]`,
    }
  },
  {
    id: "power-of-two",
    title: "Power of Two",
    difficulty: "Easy",
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two, if there exists an integer x such that n == 2^x.",
    examples: [
      { input: "n = 1", output: "true", explanation: "2^0 = 1" },
      { input: "n = 16", output: "true", explanation: "2^4 = 16" },
      { input: "n = 3", output: "false", explanation: "3 is not a power of 2" }
    ],
    templates: {
      javascript: `function isPowerOfTwo(n) {
  // Write your solution here
  
}

// Test your solution
console.log(isPowerOfTwo(1));  // Expected: true
console.log(isPowerOfTwo(16)); // Expected: true
console.log(isPowerOfTwo(3));  // Expected: false`,
      python: `def is_power_of_two(n):
    # Write your solution here
    pass

# Test your solution
print(is_power_of_two(1))   # Expected: True
print(is_power_of_two(16))  # Expected: True
print(is_power_of_two(3))   # Expected: False`,
      java: `class Solution {
    public static boolean isPowerOfTwo(int n) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(1));  // Expected: true
        System.out.println(isPowerOfTwo(16)); // Expected: true
        System.out.println(isPowerOfTwo(3));  // Expected: false
    }
}`,
      cpp: `#include <iostream>
using namespace std;

bool isPowerOfTwo(int n) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isPowerOfTwo(1) << endl;  // Expected: true
    cout << boolalpha << isPowerOfTwo(16) << endl; // Expected: true
    cout << boolalpha << isPowerOfTwo(3) << endl;  // Expected: false
    return 0;
}`,
      typescript: `function isPowerOfTwo(n: number): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isPowerOfTwo(1));  // Expected: true
console.log(isPowerOfTwo(16)); // Expected: true
console.log(isPowerOfTwo(3));  // Expected: false`,
    }
  },
  {
    id: "happy-number",
    title: "Happy Number",
    difficulty: "Easy",
    description: "Write an algorithm to determine if a number n is happy. A happy number is defined by: starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat until the number equals 1, or it loops endlessly in a cycle.",
    examples: [
      { input: "n = 19", output: "true", explanation: "1² + 9² = 82 → 8² + 2² = 68 → ... → 1" },
      { input: "n = 2", output: "false", explanation: "The sequence enters a cycle that doesn't include 1" }
    ],
    templates: {
      javascript: `function isHappy(n) {
  // Write your solution here
  
}

// Test your solution
console.log(isHappy(19)); // Expected: true
console.log(isHappy(2));  // Expected: false`,
      python: `def is_happy(n):
    # Write your solution here
    pass

# Test your solution
print(is_happy(19))  # Expected: True
print(is_happy(2))   # Expected: False`,
      java: `class Solution {
    public static boolean isHappy(int n) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isHappy(19)); // Expected: true
        System.out.println(isHappy(2));  // Expected: false
    }
}`,
      cpp: `#include <iostream>
using namespace std;

bool isHappy(int n) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isHappy(19) << endl; // Expected: true
    cout << boolalpha << isHappy(2) << endl;  // Expected: false
    return 0;
}`,
      typescript: `function isHappy(n: number): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isHappy(19)); // Expected: true
console.log(isHappy(2));  // Expected: false`,
    }
  },
  {
    id: "intersection-two-arrays",
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]", explanation: "2 is the only element in both arrays" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[9,4]", explanation: "9 and 4 are in both arrays" }
    ],
    templates: {
      javascript: `function intersection(nums1, nums2) {
  // Write your solution here
  
}

// Test your solution
console.log(intersection([1,2,2,1], [2,2]));       // Expected: [2]
console.log(intersection([4,9,5], [9,4,9,8,4]));  // Expected: [9,4] or [4,9]`,
      python: `def intersection(nums1, nums2):
    # Write your solution here
    pass

# Test your solution
print(intersection([1,2,2,1], [2,2]))      # Expected: [2]
print(intersection([4,9,5], [9,4,9,8,4]))  # Expected: [9,4] or [4,9]`,
      java: `import java.util.*;

class Solution {
    public static int[] intersection(int[] nums1, int[] nums2) {
        // Write your solution here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(intersection(new int[]{1,2,2,1}, new int[]{2,2})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums1 = {1,2,2,1}, nums2 = {2,2};
    vector<int> result = intersection(nums1, nums2);
    for (int n : result) cout << n << " ";
    cout << endl; // Expected: 2
    return 0;
}`,
      typescript: `function intersection(nums1: number[], nums2: number[]): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(intersection([1,2,2,1], [2,2]));       // Expected: [2]
console.log(intersection([4,9,5], [9,4,9,8,4]));  // Expected: [9,4] or [4,9]`,
    }
  },
  {
    id: "first-unique-character",
    title: "First Unique Character in a String",
    difficulty: "Easy",
    description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    examples: [
      { input: 's = "leetcode"', output: "0", explanation: "'l' is the first unique character" },
      { input: 's = "loveleetcode"', output: "2", explanation: "'v' is the first unique character" },
      { input: 's = "aabb"', output: "-1", explanation: "No unique characters" }
    ],
    templates: {
      javascript: `function firstUniqChar(s) {
  // Write your solution here
  
}

// Test your solution
console.log(firstUniqChar("leetcode"));     // Expected: 0
console.log(firstUniqChar("loveleetcode")); // Expected: 2
console.log(firstUniqChar("aabb"));         // Expected: -1`,
      python: `def first_uniq_char(s):
    # Write your solution here
    pass

# Test your solution
print(first_uniq_char("leetcode"))      # Expected: 0
print(first_uniq_char("loveleetcode"))  # Expected: 2
print(first_uniq_char("aabb"))          # Expected: -1`,
      java: `class Solution {
    public static int firstUniqChar(String s) {
        // Write your solution here
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(firstUniqChar("leetcode"));     // Expected: 0
        System.out.println(firstUniqChar("loveleetcode")); // Expected: 2
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int firstUniqChar(string s) {
    // Write your solution here
    return -1;
}

int main() {
    cout << firstUniqChar("leetcode") << endl;     // Expected: 0
    cout << firstUniqChar("loveleetcode") << endl; // Expected: 2
    return 0;
}`,
      typescript: `function firstUniqChar(s: string): number {
  // Write your solution here
  return -1;
}

// Test your solution
console.log(firstUniqChar("leetcode"));     // Expected: 0
console.log(firstUniqChar("loveleetcode")); // Expected: 2`,
    }
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Same letters, different arrangement" },
      { input: 's = "rat", t = "car"', output: "false", explanation: "Different letters" }
    ],
    templates: {
      javascript: `function isAnagram(s, t) {
  // Write your solution here
  
}

// Test your solution
console.log(isAnagram("anagram", "nagaram")); // Expected: true
console.log(isAnagram("rat", "car"));         // Expected: false`,
      python: `def is_anagram(s, t):
    # Write your solution here
    pass

# Test your solution
print(is_anagram("anagram", "nagaram"))  # Expected: True
print(is_anagram("rat", "car"))          # Expected: False`,
      java: `class Solution {
    public static boolean isAnagram(String s, String t) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // Expected: true
        System.out.println(isAnagram("rat", "car"));         // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isAnagram("anagram", "nagaram") << endl; // Expected: true
    cout << boolalpha << isAnagram("rat", "car") << endl;         // Expected: false
    return 0;
}`,
      typescript: `function isAnagram(s: string, t: string): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isAnagram("anagram", "nagaram")); // Expected: true
console.log(isAnagram("rat", "car"));         // Expected: false`,
    }
  },
  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2", explanation: "n = 3, so range is [0,3]. 2 is missing." },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8", explanation: "8 is missing from the sequence" }
    ],
    templates: {
      javascript: `function missingNumber(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(missingNumber([3,0,1]));               // Expected: 2
console.log(missingNumber([9,6,4,2,3,5,7,0,1]));  // Expected: 8`,
      python: `def missing_number(nums):
    # Write your solution here
    pass

# Test your solution
print(missing_number([3,0,1]))               # Expected: 2
print(missing_number([9,6,4,2,3,5,7,0,1]))  # Expected: 8`,
      java: `class Solution {
    public static int missingNumber(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(missingNumber(new int[]{3,0,1})); // Expected: 2
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int missingNumber(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {3,0,1};
    cout << missingNumber(nums) << endl; // Expected: 2
    return 0;
}`,
      typescript: `function missingNumber(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(missingNumber([3,0,1]));               // Expected: 2
console.log(missingNumber([9,6,4,2,3,5,7,0,1]));  // Expected: 8`,
    }
  },
  {
    id: "reverse-bits",
    title: "Reverse Bits",
    difficulty: "Easy",
    description: "Reverse bits of a given 32 bits unsigned integer.",
    examples: [
      { input: "n = 00000010100101000001111010011100", output: "00111001011110000010100101000000", explanation: "Input is 43261596, output is 964176192" }
    ],
    templates: {
      javascript: `function reverseBits(n) {
  // Write your solution here
  
}

// Test your solution
console.log(reverseBits(43261596)); // Expected: 964176192`,
      python: `def reverse_bits(n):
    # Write your solution here
    pass

# Test your solution
print(reverse_bits(43261596))  # Expected: 964176192`,
      java: `class Solution {
    public static int reverseBits(int n) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(reverseBits(43261596)); // Expected: 964176192
    }
}`,
      cpp: `#include <iostream>
using namespace std;

uint32_t reverseBits(uint32_t n) {
    // Write your solution here
    return 0;
}

int main() {
    cout << reverseBits(43261596) << endl; // Expected: 964176192
    return 0;
}`,
      typescript: `function reverseBits(n: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(reverseBits(43261596)); // Expected: 964176192`,
    }
  },
  
  // ============================================================
  // NEW MEDIUM CHALLENGES (17 more)
  // ============================================================
  {
    id: "letter-combinations-phone",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    description: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent (like on a telephone keypad).",
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: "2 maps to abc, 3 maps to def" }
    ],
    templates: {
      javascript: `function letterCombinations(digits) {
  // Write your solution here
  
}

// Test your solution
console.log(letterCombinations("23")); 
// Expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
      python: `def letter_combinations(digits):
    # Write your solution here
    pass

# Test your solution
print(letter_combinations("23"))  
# Expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
      java: `import java.util.*;

class Solution {
    public static List<String> letterCombinations(String digits) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(letterCombinations("23"));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> letterCombinations(string digits) {
    // Write your solution here
    return {};
}

int main() {
    vector<string> result = letterCombinations("23");
    for (const string& s : result) cout << s << " ";
    cout << endl;
    return 0;
}`,
      typescript: `function letterCombinations(digits: string): string[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(letterCombinations("23"));`,
    }
  },
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [
      { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "All valid combinations of 3 pairs" },
      { input: "n = 1", output: '["()"]', explanation: "Only one valid combination" }
    ],
    templates: {
      javascript: `function generateParenthesis(n) {
  // Write your solution here
  
}

// Test your solution
console.log(generateParenthesis(3)); 
// Expected: ["((()))","(()())","(())()","()(())","()()()"]`,
      python: `def generate_parenthesis(n):
    # Write your solution here
    pass

# Test your solution
print(generate_parenthesis(3))`,
      java: `import java.util.*;

class Solution {
    public static List<String> generateParenthesis(int n) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(generateParenthesis(3));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> generateParenthesis(int n) {
    // Write your solution here
    return {};
}

int main() {
    vector<string> result = generateParenthesis(3);
    for (const string& s : result) cout << s << " ";
    cout << endl;
    return 0;
}`,
      typescript: `function generateParenthesis(n: number): string[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(generateParenthesis(3));`,
    }
  },
  {
    id: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Given a rotated sorted array of unique elements and a target, return the index of target if it's in the array, or -1 if it's not. You must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is at index 4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 is not in the array" }
    ],
    templates: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}

// Test your solution
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Expected: -1`,
      python: `def search(nums, target):
    # Write your solution here
    pass

# Test your solution
print(search([4,5,6,7,0,1,2], 0))  # Expected: 4
print(search([4,5,6,7,0,1,2], 3))  # Expected: -1`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 0)); // Expected: 4
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your solution here
    return -1;
}

int main() {
    vector<int> nums = {4,5,6,7,0,1,2};
    cout << search(nums, 0) << endl; // Expected: 4
    return 0;
}`,
      typescript: `function search(nums: number[], target: number): number {
  // Write your solution here
  return -1;
}

// Test your solution
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4`,
    }
  },
  {
    id: "find-first-last-position",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return [-1, -1]. O(log n) time complexity required.",
    examples: [
      { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]", explanation: "8 appears at indices 3 and 4" },
      { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]", explanation: "6 is not in the array" }
    ],
    templates: {
      javascript: `function searchRange(nums, target) {
  // Write your solution here
  
}

// Test your solution
console.log(searchRange([5,7,7,8,8,10], 8)); // Expected: [3,4]
console.log(searchRange([5,7,7,8,8,10], 6)); // Expected: [-1,-1]`,
      python: `def search_range(nums, target):
    # Write your solution here
    pass

# Test your solution
print(search_range([5,7,7,8,8,10], 8))  # Expected: [3,4]
print(search_range([5,7,7,8,8,10], 6))  # Expected: [-1,-1]`,
      java: `import java.util.Arrays;

class Solution {
    public static int[] searchRange(int[] nums, int target) {
        // Write your solution here
        return new int[]{-1,-1};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(searchRange(new int[]{5,7,7,8,8,10}, 8)));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> searchRange(vector<int>& nums, int target) {
    // Write your solution here
    return {-1,-1};
}

int main() {
    vector<int> nums = {5,7,7,8,8,10};
    vector<int> result = searchRange(nums, 8);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
      typescript: `function searchRange(nums: number[], target: number): number[] {
  // Write your solution here
  return [-1,-1];
}

// Test your solution
console.log(searchRange([5,7,7,8,8,10], 8)); // Expected: [3,4]`,
    }
  },
  {
    id: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen unlimited times.",
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]", explanation: "2+2+3=7 and 7=7" }
    ],
    templates: {
      javascript: `function combinationSum(candidates, target) {
  // Write your solution here
  
}

// Test your solution
console.log(combinationSum([2,3,6,7], 7)); // Expected: [[2,2,3],[7]]`,
      python: `def combination_sum(candidates, target):
    # Write your solution here
    pass

# Test your solution
print(combination_sum([2,3,6,7], 7))  # Expected: [[2,2,3],[7]]`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2,3,6,7}, 7));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> candidates = {2,3,6,7};
    vector<vector<int>> result = combinationSum(candidates, 7);
    // Print result
    return 0;
}`,
      typescript: `function combinationSum(candidates: number[], target: number): number[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(combinationSum([2,3,6,7], 7)); // Expected: [[2,2,3],[7]]`,
    }
  },
  {
    id: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All 6 permutations of [1,2,3]" }
    ],
    templates: {
      javascript: `function permute(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(permute([1,2,3]));`,
      python: `def permute(nums):
    # Write your solution here
    pass

# Test your solution
print(permute([1,2,3]))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> permute(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(permute(new int[]{1,2,3}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> permute(vector<int>& nums) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {1,2,3};
    vector<vector<int>> result = permute(nums);
    return 0;
}`,
      typescript: `function permute(nums: number[]): number[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(permute([1,2,3]));`,
    }
  },
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", explanation: "All 8 subsets" }
    ],
    templates: {
      javascript: `function subsets(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(subsets([1,2,3]));`,
      python: `def subsets(nums):
    # Write your solution here
    pass

# Test your solution
print(subsets([1,2,3]))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1,2,3}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> subsets(vector<int>& nums) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {1,2,3};
    vector<vector<int>> result = subsets(nums);
    return 0;
}`,
      typescript: `function subsets(nums: number[]): number[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(subsets([1,2,3]));`,
    }
  },
  {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true", explanation: '"leetcode" can be segmented as "leet code"' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true", explanation: '"applepenapple" = "apple pen apple"' }
    ],
    templates: {
      javascript: `function wordBreak(s, wordDict) {
  // Write your solution here
  
}

// Test your solution
console.log(wordBreak("leetcode", ["leet","code"]));       // Expected: true
console.log(wordBreak("applepenapple", ["apple","pen"])); // Expected: true`,
      python: `def word_break(s, word_dict):
    # Write your solution here
    pass

# Test your solution
print(word_break("leetcode", ["leet","code"]))        # Expected: True
print(word_break("applepenapple", ["apple","pen"]))  # Expected: True`,
      java: `import java.util.*;

class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(wordBreak("leetcode", Arrays.asList("leet","code")));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

bool wordBreak(string s, vector<string>& wordDict) {
    // Write your solution here
    return false;
}

int main() {
    vector<string> wordDict = {"leet","code"};
    cout << boolalpha << wordBreak("leetcode", wordDict) << endl;
    return 0;
}`,
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(wordBreak("leetcode", ["leet","code"])); // Expected: true`,
    }
  },
  {
    id: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    description: "You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems connected - if two adjacent houses are broken into, the police will be alerted. Return the maximum amount you can rob tonight without alerting police.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 and 3: 1 + 3 = 4" },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1, 3, 5: 2 + 9 + 1 = 12" }
    ],
    templates: {
      javascript: `function rob(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(rob([1,2,3,1]));    // Expected: 4
console.log(rob([2,7,9,3,1])); // Expected: 12`,
      python: `def rob(nums):
    # Write your solution here
    pass

# Test your solution
print(rob([1,2,3,1]))     # Expected: 4
print(rob([2,7,9,3,1]))  # Expected: 12`,
      java: `class Solution {
    public static int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(rob(new int[]{1,2,3,1}));    // Expected: 4
        System.out.println(rob(new int[]{2,7,9,3,1})); // Expected: 12
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int rob(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {1,2,3,1};
    cout << rob(nums) << endl; // Expected: 4
    return 0;
}`,
      typescript: `function rob(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(rob([1,2,3,1]));    // Expected: 4
console.log(rob([2,7,9,3,1])); // Expected: 12`,
    }
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "One island" },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "Three islands" }
    ],
    templates: {
      javascript: `function numIslands(grid) {
  // Write your solution here
  
}

// Test your solution
console.log(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
])); // Expected: 1`,
      python: `def num_islands(grid):
    # Write your solution here
    pass

# Test your solution
print(num_islands([
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"]
]))  # Expected: 1`,
      java: `class Solution {
    public static int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        char[][] grid = {
            {'1','1','1','1','0'},
            {'1','1','0','1','0'},
            {'1','1','0','0','0'},
            {'0','0','0','0','0'}
        };
        System.out.println(numIslands(grid)); // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Write your solution here
    return 0;
}

int main() {
    vector<vector<char>> grid = {
        {'1','1','1','1','0'},
        {'1','1','0','1','0'},
        {'1','1','0','0','0'},
        {'0','0','0','0','0'}
    };
    cout << numIslands(grid) << endl; // Expected: 1
    return 0;
}`,
      typescript: `function numIslands(grid: string[][]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
])); // Expected: 1`,
    }
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    description: "There are numCourses courses labeled from 0 to numCourses - 1. You are given prerequisites[i] = [ai, bi] indicating you must take course bi before course ai. Return true if you can finish all courses, or false otherwise.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 then course 1" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Circular dependency" }
    ],
    templates: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Write your solution here
  
}

// Test your solution
console.log(canFinish(2, [[1,0]]));       // Expected: true
console.log(canFinish(2, [[1,0],[0,1]])); // Expected: false`,
      python: `def can_finish(num_courses, prerequisites):
    # Write your solution here
    pass

# Test your solution
print(can_finish(2, [[1,0]]))        # Expected: True
print(can_finish(2, [[1,0],[0,1]]))  # Expected: False`,
      java: `class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(canFinish(2, new int[][]{{1,0}}));        // Expected: true
        System.out.println(canFinish(2, new int[][]{{1,0},{0,1}}));  // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // Write your solution here
    return false;
}

int main() {
    vector<vector<int>> prereqs = {{1,0}};
    cout << boolalpha << canFinish(2, prereqs) << endl; // Expected: true
    return 0;
}`,
      typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(canFinish(2, [[1,0]]));       // Expected: true
console.log(canFinish(2, [[1,0],[0,1]])); // Expected: false`,
    }
  },
  {
    id: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in sorted order, not the kth distinct element.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "Sorted: [1,2,3,4,5,6], 2nd largest is 5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", explanation: "Sorted: [1,2,2,3,3,4,5,5,6], 4th largest is 4" }
    ],
    templates: {
      javascript: `function findKthLargest(nums, k) {
  // Write your solution here
  
}

// Test your solution
console.log(findKthLargest([3,2,1,5,6,4], 2));       // Expected: 5
console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4)); // Expected: 4`,
      python: `def find_kth_largest(nums, k):
    # Write your solution here
    pass

# Test your solution
print(find_kth_largest([3,2,1,5,6,4], 2))        # Expected: 5
print(find_kth_largest([3,2,3,1,2,4,5,5,6], 4))  # Expected: 4`,
      java: `class Solution {
    public static int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3,2,1,5,6,4}, 2)); // Expected: 5
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int findKthLargest(vector<int>& nums, int k) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {3,2,1,5,6,4};
    cout << findKthLargest(nums, 2) << endl; // Expected: 5
    return 0;
}`,
      typescript: `function findKthLargest(nums: number[], k: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(findKthLargest([3,2,1,5,6,4], 2)); // Expected: 5`,
    }
  },
  {
    id: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    description: "A message containing letters A-Z can be encoded with A=1, B=2, ..., Z=26. Given a string s containing only digits, return the number of ways to decode it.",
    examples: [
      { input: 's = "12"', output: "2", explanation: '"12" could be decoded as "AB" (1 2) or "L" (12)' },
      { input: 's = "226"', output: "3", explanation: '"226" could be "BZ", "VF", or "BBF"' }
    ],
    templates: {
      javascript: `function numDecodings(s) {
  // Write your solution here
  
}

// Test your solution
console.log(numDecodings("12"));  // Expected: 2
console.log(numDecodings("226")); // Expected: 3`,
      python: `def num_decodings(s):
    # Write your solution here
    pass

# Test your solution
print(num_decodings("12"))   # Expected: 2
print(num_decodings("226"))  # Expected: 3`,
      java: `class Solution {
    public static int numDecodings(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(numDecodings("12"));  // Expected: 2
        System.out.println(numDecodings("226")); // Expected: 3
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int numDecodings(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << numDecodings("12") << endl;  // Expected: 2
    cout << numDecodings("226") << endl; // Expected: 3
    return 0;
}`,
      typescript: `function numDecodings(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(numDecodings("12"));  // Expected: 2
console.log(numDecodings("226")); // Expected: 3`,
    }
  },
  {
    id: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    description: "A robot is located at the top-left corner of an m x n grid. The robot can only move either down or right at any point. How many unique paths are there to reach the bottom-right corner?",
    examples: [
      { input: "m = 3, n = 7", output: "28", explanation: "28 unique paths from top-left to bottom-right" },
      { input: "m = 3, n = 2", output: "3", explanation: "Right+Right+Down, Right+Down+Right, Down+Right+Right" }
    ],
    templates: {
      javascript: `function uniquePaths(m, n) {
  // Write your solution here
  
}

// Test your solution
console.log(uniquePaths(3, 7)); // Expected: 28
console.log(uniquePaths(3, 2)); // Expected: 3`,
      python: `def unique_paths(m, n):
    # Write your solution here
    pass

# Test your solution
print(unique_paths(3, 7))  # Expected: 28
print(unique_paths(3, 2))  # Expected: 3`,
      java: `class Solution {
    public static int uniquePaths(int m, int n) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 7)); // Expected: 28
        System.out.println(uniquePaths(3, 2)); // Expected: 3
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int uniquePaths(int m, int n) {
    // Write your solution here
    return 0;
}

int main() {
    cout << uniquePaths(3, 7) << endl; // Expected: 28
    cout << uniquePaths(3, 2) << endl; // Expected: 3
    return 0;
}`,
      typescript: `function uniquePaths(m: number, n: number): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(uniquePaths(3, 7)); // Expected: 28
console.log(uniquePaths(3, 2)); // Expected: 3`,
    }
  },
  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    description: "You are given an integer array nums. You are initially at the first index, and each element represents your maximum jump length from that position. Return true if you can reach the last index.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step to index 1, then 3 steps to the last index" },
      { input: "nums = [3,2,1,0,4]", output: "false", explanation: "Always stuck at index 3" }
    ],
    templates: {
      javascript: `function canJump(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(canJump([2,3,1,1,4])); // Expected: true
console.log(canJump([3,2,1,0,4])); // Expected: false`,
      python: `def can_jump(nums):
    # Write your solution here
    pass

# Test your solution
print(can_jump([2,3,1,1,4]))  # Expected: True
print(can_jump([3,2,1,0,4]))  # Expected: False`,
      java: `class Solution {
    public static boolean canJump(int[] nums) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2,3,1,1,4})); // Expected: true
        System.out.println(canJump(new int[]{3,2,1,0,4})); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

bool canJump(vector<int>& nums) {
    // Write your solution here
    return false;
}

int main() {
    vector<int> nums1 = {2,3,1,1,4};
    vector<int> nums2 = {3,2,1,0,4};
    cout << boolalpha << canJump(nums1) << endl; // Expected: true
    cout << boolalpha << canJump(nums2) << endl; // Expected: false
    return 0;
}`,
      typescript: `function canJump(nums: number[]): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(canJump([2,3,1,1,4])); // Expected: true
console.log(canJump([3,2,1,0,4])); // Expected: false`,
    }
  },
  {
    id: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "Spiral clockwise from outside to inside" }
    ],
    templates: {
      javascript: `function spiralOrder(matrix) {
  // Write your solution here
  
}

// Test your solution
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]])); 
// Expected: [1,2,3,6,9,8,7,4,5]`,
      python: `def spiral_order(matrix):
    # Write your solution here
    pass

# Test your solution
print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))  
# Expected: [1,2,3,6,9,8,7,4,5]`,
      java: `import java.util.*;

class Solution {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Write your solution here
    return {};
}

int main() {
    vector<vector<int>> matrix = {{1,2,3},{4,5,6},{7,8,9}};
    vector<int> result = spiralOrder(matrix);
    for (int n : result) cout << n << " ";
    cout << endl;
    return 0;
}`,
      typescript: `function spiralOrder(matrix: number[][]): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));`,
    }
  },
  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    description: "Given an m x n integer matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
    examples: [
      { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]", explanation: "The middle element was 0, so its row and column become 0" }
    ],
    templates: {
      javascript: `function setZeroes(matrix) {
  // Write your solution here - modify in-place
  
}

// Test your solution
const matrix = [[1,1,1],[1,0,1],[1,1,1]];
setZeroes(matrix);
console.log(matrix); // Expected: [[1,0,1],[0,0,0],[1,0,1]]`,
      python: `def set_zeroes(matrix):
    # Write your solution here - modify in-place
    pass

# Test your solution
matrix = [[1,1,1],[1,0,1],[1,1,1]]
set_zeroes(matrix)
print(matrix)  # Expected: [[1,0,1],[0,0,0],[1,0,1]]`,
      java: `class Solution {
    public static void setZeroes(int[][] matrix) {
        // Write your solution here - modify in-place
    }
    
    public static void main(String[] args) {
        int[][] matrix = {{1,1,1},{1,0,1},{1,1,1}};
        setZeroes(matrix);
        // Print result
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {
    // Write your solution here - modify in-place
}

int main() {
    vector<vector<int>> matrix = {{1,1,1},{1,0,1},{1,1,1}};
    setZeroes(matrix);
    return 0;
}`,
      typescript: `function setZeroes(matrix: number[][]): void {
  // Write your solution here - modify in-place
  
}

// Test your solution
const matrix = [[1,1,1],[1,0,1],[1,1,1]];
setZeroes(matrix);
console.log(matrix);`,
    }
  },
  
  // ============================================================
  // NEW HARD CHALLENGES (16 more)
  // ============================================================
  {
    id: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
    examples: [
      { input: "n = 4", output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: "Two solutions for 4-queens" }
    ],
    templates: {
      javascript: `function solveNQueens(n) {
  // Write your solution here
  
}

// Test your solution
console.log(solveNQueens(4));`,
      python: `def solve_n_queens(n):
    # Write your solution here
    pass

# Test your solution
print(solve_n_queens(4))`,
      java: `import java.util.*;

class Solution {
    public static List<List<String>> solveNQueens(int n) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(solveNQueens(4));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<vector<string>> solveNQueens(int n) {
    // Write your solution here
    return {};
}

int main() {
    auto result = solveNQueens(4);
    cout << "Found " << result.size() << " solutions" << endl;
    return 0;
}`,
      typescript: `function solveNQueens(n: number): string[][] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(solveNQueens(4));`,
    }
  },
  {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    difficulty: "Hard",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells (represented by '.'). A sudoku solution must satisfy all of the following rules: Each row, column, and 3x3 sub-box must contain the digits 1-9 without repetition.",
    examples: [
      { input: "A 9x9 Sudoku board with some cells filled", output: "The completed board", explanation: "Fill all empty cells following Sudoku rules" }
    ],
    templates: {
      javascript: `function solveSudoku(board) {
  // Write your solution here - modify board in-place
  
}

// Test your solution
const board = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
];
solveSudoku(board);
console.log(board);`,
      python: `def solve_sudoku(board):
    # Write your solution here - modify board in-place
    pass

# Test your solution
board = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
]
solve_sudoku(board)
for row in board:
    print(row)`,
      java: `class Solution {
    public static void solveSudoku(char[][] board) {
        // Write your solution here - modify board in-place
    }
    
    public static void main(String[] args) {
        // Test with a Sudoku puzzle
        System.out.println("Implement and test");
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void solveSudoku(vector<vector<char>>& board) {
    // Write your solution here - modify board in-place
}

int main() {
    // Test with a Sudoku puzzle
    cout << "Implement and test" << endl;
    return 0;
}`,
      typescript: `function solveSudoku(board: string[][]): void {
  // Write your solution here - modify board in-place
  
}

// Test your solution
console.log("Implement and test");`,
    }
  },
  {
    id: "wildcard-matching",
    title: "Wildcard Matching",
    difficulty: "Hard",
    description: "Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' (matches any single character) and '*' (matches any sequence of characters, including empty).",
    examples: [
      { input: 's = "aa", p = "a"', output: "false", explanation: "'a' does not match the entire string 'aa'" },
      { input: 's = "aa", p = "*"', output: "true", explanation: "'*' matches any sequence" },
      { input: 's = "cb", p = "?a"', output: "false", explanation: "'?' matches 'c', but 'a' != 'b'" }
    ],
    templates: {
      javascript: `function isMatch(s, p) {
  // Write your solution here
  
}

// Test your solution
console.log(isMatch("aa", "a"));    // Expected: false
console.log(isMatch("aa", "*"));    // Expected: true
console.log(isMatch("cb", "?a"));   // Expected: false
console.log(isMatch("adceb", "*a*b")); // Expected: true`,
      python: `def is_match(s, p):
    # Write your solution here
    pass

# Test your solution
print(is_match("aa", "a"))      # Expected: False
print(is_match("aa", "*"))      # Expected: True
print(is_match("adceb", "*a*b")) # Expected: True`,
      java: `class Solution {
    public static boolean isMatch(String s, String p) {
        // Write your solution here
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isMatch("aa", "*"));    // Expected: true
        System.out.println(isMatch("adceb", "*a*b")); // Expected: true
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isMatch(string s, string p) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isMatch("aa", "*") << endl;    // Expected: true
    cout << boolalpha << isMatch("adceb", "*a*b") << endl; // Expected: true
    return 0;
}`,
      typescript: `function isMatch(s: string, p: string): boolean {
  // Write your solution here
  return false;
}

// Test your solution
console.log(isMatch("aa", "*"));    // Expected: true
console.log(isMatch("adceb", "*a*b")); // Expected: true`,
    }
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You can insert, delete, or replace a character.",
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: "3", explanation: "horse -> rorse -> rose -> ros" },
      { input: 'word1 = "intention", word2 = "execution"', output: "5", explanation: "intention -> inention -> enention -> exention -> exection -> execution" }
    ],
    templates: {
      javascript: `function minDistance(word1, word2) {
  // Write your solution here
  
}

// Test your solution
console.log(minDistance("horse", "ros"));          // Expected: 3
console.log(minDistance("intention", "execution")); // Expected: 5`,
      python: `def min_distance(word1, word2):
    # Write your solution here
    pass

# Test your solution
print(min_distance("horse", "ros"))           # Expected: 3
print(min_distance("intention", "execution"))  # Expected: 5`,
      java: `class Solution {
    public static int minDistance(String word1, String word2) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros"));          // Expected: 3
        System.out.println(minDistance("intention", "execution")); // Expected: 5
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int minDistance(string word1, string word2) {
    // Write your solution here
    return 0;
}

int main() {
    cout << minDistance("horse", "ros") << endl;          // Expected: 3
    cout << minDistance("intention", "execution") << endl; // Expected: 5
    return 0;
}`,
      typescript: `function minDistance(word1: string, word2: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(minDistance("horse", "ros"));          // Expected: 3
console.log(minDistance("intention", "execution")); // Expected: 5`,
    }
  },
  {
    id: "maximal-rectangle",
    title: "Maximal Rectangle",
    difficulty: "Hard",
    description: "Given a 2D binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
    examples: [
      { input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: "6", explanation: "The maximal rectangle has area 6" }
    ],
    templates: {
      javascript: `function maximalRectangle(matrix) {
  // Write your solution here
  
}

// Test your solution
console.log(maximalRectangle([
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
])); // Expected: 6`,
      python: `def maximal_rectangle(matrix):
    # Write your solution here
    pass

# Test your solution
print(maximal_rectangle([
    ["1","0","1","0","0"],
    ["1","0","1","1","1"],
    ["1","1","1","1","1"],
    ["1","0","0","1","0"]
]))  # Expected: 6`,
      java: `class Solution {
    public static int maximalRectangle(char[][] matrix) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        char[][] matrix = {
            {'1','0','1','0','0'},
            {'1','0','1','1','1'},
            {'1','1','1','1','1'},
            {'1','0','0','1','0'}
        };
        System.out.println(maximalRectangle(matrix)); // Expected: 6
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maximalRectangle(vector<vector<char>>& matrix) {
    // Write your solution here
    return 0;
}

int main() {
    vector<vector<char>> matrix = {
        {'1','0','1','0','0'},
        {'1','0','1','1','1'},
        {'1','1','1','1','1'},
        {'1','0','0','1','0'}
    };
    cout << maximalRectangle(matrix) << endl; // Expected: 6
    return 0;
}`,
      typescript: `function maximalRectangle(matrix: string[][]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(maximalRectangle([
  ["1","0","1","0","0"],
  ["1","0","1","1","1"],
  ["1","1","1","1","1"],
  ["1","0","0","1","0"]
])); // Expected: 6`,
    }
  },
  {
    id: "palindrome-partitioning-ii",
    title: "Palindrome Partitioning II",
    difficulty: "Hard",
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.",
    examples: [
      { input: 's = "aab"', output: "1", explanation: 'Partition as ["aa","b"]' },
      { input: 's = "a"', output: "0", explanation: "Already a palindrome" }
    ],
    templates: {
      javascript: `function minCut(s) {
  // Write your solution here
  
}

// Test your solution
console.log(minCut("aab")); // Expected: 1
console.log(minCut("a"));   // Expected: 0`,
      python: `def min_cut(s):
    # Write your solution here
    pass

# Test your solution
print(min_cut("aab"))  # Expected: 1
print(min_cut("a"))    # Expected: 0`,
      java: `class Solution {
    public static int minCut(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(minCut("aab")); // Expected: 1
        System.out.println(minCut("a"));   // Expected: 0
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int minCut(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << minCut("aab") << endl; // Expected: 1
    cout << minCut("a") << endl;   // Expected: 0
    return 0;
}`,
      typescript: `function minCut(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(minCut("aab")); // Expected: 1
console.log(minCut("a"));   // Expected: 0`,
    }
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence where each adjacent pair differs by a single letter. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: "hit -> hot -> dot -> dog -> cog" }
    ],
    templates: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {
  // Write your solution here
  
}

// Test your solution
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])); 
// Expected: 5`,
      python: `def ladder_length(begin_word, end_word, word_list):
    # Write your solution here
    pass

# Test your solution
print(ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"]))  
# Expected: 5`,
      java: `import java.util.*;

class Solution {
    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(ladderLength("hit", "cog", 
            Arrays.asList("hot","dot","dog","lot","log","cog"))); // Expected: 5
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    // Write your solution here
    return 0;
}

int main() {
    vector<string> wordList = {"hot","dot","dog","lot","log","cog"};
    cout << ladderLength("hit", "cog", wordList) << endl; // Expected: 5
    return 0;
}`,
      typescript: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"]));`,
    }
  },
  {
    id: "binary-tree-max-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. The path sum is the sum of the node values. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    examples: [
      { input: "root = [1,2,3]", output: "6", explanation: "Optimal path is 2 -> 1 -> 3 with sum 6" },
      { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "Optimal path is 15 -> 20 -> 7 with sum 42" }
    ],
    templates: {
      javascript: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxPathSum(root) {
  // Write your solution here
  
}

// Test your solution
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log(maxPathSum(root)); // Expected: 6`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root):
    # Write your solution here
    pass

# Test your solution
root = TreeNode(1, TreeNode(2), TreeNode(3))
print(max_path_sum(root))  # Expected: 6`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static int maxPathSum(TreeNode root) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        System.out.println(maxPathSum(root)); // Expected: 6
    }
}`,
      cpp: `#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int maxPathSum(TreeNode* root) {
    // Write your solution here
    return 0;
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    cout << maxPathSum(root) << endl; // Expected: 6
    return 0;
}`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function maxPathSum(root: TreeNode | null): number {
  // Write your solution here
  return 0;
}

// Test your solution
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log(maxPathSum(root)); // Expected: 6`,
    }
  },
  {
    id: "first-missing-positive",
    title: "First Missing Positive",
    difficulty: "Hard",
    description: "Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
    examples: [
      { input: "nums = [1,2,0]", output: "3", explanation: "1 and 2 are present, 3 is missing" },
      { input: "nums = [3,4,-1,1]", output: "2", explanation: "1 is present, 2 is missing" },
      { input: "nums = [7,8,9,11,12]", output: "1", explanation: "1 is missing" }
    ],
    templates: {
      javascript: `function firstMissingPositive(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(firstMissingPositive([1,2,0]));     // Expected: 3
console.log(firstMissingPositive([3,4,-1,1])); // Expected: 2
console.log(firstMissingPositive([7,8,9,11,12])); // Expected: 1`,
      python: `def first_missing_positive(nums):
    # Write your solution here
    pass

# Test your solution
print(first_missing_positive([1,2,0]))      # Expected: 3
print(first_missing_positive([3,4,-1,1]))  # Expected: 2`,
      java: `class Solution {
    public static int firstMissingPositive(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(firstMissingPositive(new int[]{1,2,0}));     // Expected: 3
        System.out.println(firstMissingPositive(new int[]{3,4,-1,1})); // Expected: 2
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int firstMissingPositive(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums1 = {1,2,0};
    vector<int> nums2 = {3,4,-1,1};
    cout << firstMissingPositive(nums1) << endl; // Expected: 3
    cout << firstMissingPositive(nums2) << endl; // Expected: 2
    return 0;
}`,
      typescript: `function firstMissingPositive(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(firstMissingPositive([1,2,0]));     // Expected: 3
console.log(firstMissingPositive([3,4,-1,1])); // Expected: 2`,
    }
  },
  {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Hard",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Longest consecutive sequence is [1, 2, 3, 4]" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9", explanation: "Longest is [0-8]" }
    ],
    templates: {
      javascript: `function longestConsecutive(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(longestConsecutive([100,4,200,1,3,2]));       // Expected: 4
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // Expected: 9`,
      python: `def longest_consecutive(nums):
    # Write your solution here
    pass

# Test your solution
print(longest_consecutive([100,4,200,1,3,2]))        # Expected: 4
print(longest_consecutive([0,3,7,2,5,8,4,6,0,1]))  # Expected: 9`,
      java: `class Solution {
    public static int longestConsecutive(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100,4,200,1,3,2})); // Expected: 4
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {100,4,200,1,3,2};
    cout << longestConsecutive(nums) << endl; // Expected: 4
    return 0;
}`,
      typescript: `function longestConsecutive(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(longestConsecutive([100,4,200,1,3,2])); // Expected: 4`,
    }
  },
  {
    id: "text-justification",
    title: "Text Justification",
    difficulty: "Hard",
    description: "Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified. The last line should be left-justified.",
    examples: [
      { input: 'words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16', output: '["This    is    an","example  of text","justification.  "]', explanation: "Words are packed and justified" }
    ],
    templates: {
      javascript: `function fullJustify(words, maxWidth) {
  // Write your solution here
  
}

// Test your solution
console.log(fullJustify(
  ["This", "is", "an", "example", "of", "text", "justification."], 
  16
));`,
      python: `def full_justify(words, max_width):
    # Write your solution here
    pass

# Test your solution
print(full_justify(
    ["This", "is", "an", "example", "of", "text", "justification."], 
    16
))`,
      java: `import java.util.*;

class Solution {
    public static List<String> fullJustify(String[] words, int maxWidth) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(fullJustify(
            new String[]{"This","is","an","example","of","text","justification."}, 16));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> fullJustify(vector<string>& words, int maxWidth) {
    // Write your solution here
    return {};
}

int main() {
    vector<string> words = {"This","is","an","example","of","text","justification."};
    auto result = fullJustify(words, 16);
    for (const string& line : result) cout << '"' << line << '"' << endl;
    return 0;
}`,
      typescript: `function fullJustify(words: string[], maxWidth: number): string[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(fullJustify(
  ["This", "is", "an", "example", "of", "text", "justification."], 
  16
));`,
    }
  },
  {
    id: "basic-calculator",
    title: "Basic Calculator",
    difficulty: "Hard",
    description: "Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result. The expression can contain '+', '-', '(', ')', and non-negative integers. No multiplication or division.",
    examples: [
      { input: 's = "1 + 1"', output: "2", explanation: "1 + 1 = 2" },
      { input: 's = " 2-1 + 2 "', output: "3", explanation: "2 - 1 + 2 = 3" },
      { input: 's = "(1+(4+5+2)-3)+(6+8)"', output: "23", explanation: "Evaluate nested expressions" }
    ],
    templates: {
      javascript: `function calculate(s) {
  // Write your solution here
  
}

// Test your solution
console.log(calculate("1 + 1"));               // Expected: 2
console.log(calculate(" 2-1 + 2 "));           // Expected: 3
console.log(calculate("(1+(4+5+2)-3)+(6+8)")); // Expected: 23`,
      python: `def calculate(s):
    # Write your solution here
    pass

# Test your solution
print(calculate("1 + 1"))                # Expected: 2
print(calculate("(1+(4+5+2)-3)+(6+8)"))  # Expected: 23`,
      java: `class Solution {
    public static int calculate(String s) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(calculate("1 + 1"));               // Expected: 2
        System.out.println(calculate("(1+(4+5+2)-3)+(6+8)")); // Expected: 23
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int calculate(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << calculate("1 + 1") << endl;               // Expected: 2
    cout << calculate("(1+(4+5+2)-3)+(6+8)") << endl; // Expected: 23
    return 0;
}`,
      typescript: `function calculate(s: string): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(calculate("1 + 1"));               // Expected: 2
console.log(calculate("(1+(4+5+2)-3)+(6+8)")); // Expected: 23`,
    }
  },
  {
    id: "count-smaller-numbers",
    title: "Count of Smaller Numbers After Self",
    difficulty: "Hard",
    description: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    examples: [
      { input: "nums = [5,2,6,1]", output: "[2,1,1,0]", explanation: "To the right of 5: two smaller (2,1). To the right of 2: one smaller (1). Etc." }
    ],
    templates: {
      javascript: `function countSmaller(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(countSmaller([5,2,6,1])); // Expected: [2,1,1,0]`,
      python: `def count_smaller(nums):
    # Write your solution here
    pass

# Test your solution
print(count_smaller([5,2,6,1]))  # Expected: [2,1,1,0]`,
      java: `import java.util.*;

class Solution {
    public static List<Integer> countSmaller(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(countSmaller(new int[]{5,2,6,1})); // Expected: [2,1,1,0]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> countSmaller(vector<int>& nums) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {5,2,6,1};
    vector<int> result = countSmaller(nums);
    for (int n : result) cout << n << " ";
    cout << endl; // Expected: 2 1 1 0
    return 0;
}`,
      typescript: `function countSmaller(nums: number[]): number[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(countSmaller([5,2,6,1])); // Expected: [2,1,1,0]`,
    }
  },
  {
    id: "burst-balloons",
    title: "Burst Balloons",
    difficulty: "Hard",
    description: "You are given n balloons indexed 0 to n-1. Each balloon is painted with a number on it represented by nums[i]. Burst all balloons. When bursting balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins (treating out-of-bounds as 1). Return the maximum coins you can collect.",
    examples: [
      { input: "nums = [3,1,5,8]", output: "167", explanation: "Optimal order: burst 1, then 5, then 3, then 8 -> 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167" }
    ],
    templates: {
      javascript: `function maxCoins(nums) {
  // Write your solution here
  
}

// Test your solution
console.log(maxCoins([3,1,5,8])); // Expected: 167`,
      python: `def max_coins(nums):
    # Write your solution here
    pass

# Test your solution
print(max_coins([3,1,5,8]))  # Expected: 167`,
      java: `class Solution {
    public static int maxCoins(int[] nums) {
        // Write your solution here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxCoins(new int[]{3,1,5,8})); // Expected: 167
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxCoins(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {3,1,5,8};
    cout << maxCoins(nums) << endl; // Expected: 167
    return 0;
}`,
      typescript: `function maxCoins(nums: number[]): number {
  // Write your solution here
  return 0;
}

// Test your solution
console.log(maxCoins([3,1,5,8])); // Expected: 167`,
    }
  },
  {
    id: "remove-invalid-parentheses",
    title: "Remove Invalid Parentheses",
    difficulty: "Hard",
    description: "Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid. Return all the possible results.",
    examples: [
      { input: 's = "()())()"', output: '["(())()","()()()"]', explanation: "Remove one ')' to make valid" },
      { input: 's = "(a)())()"', output: '["(a())()","(a)()()"]', explanation: "Two valid options" }
    ],
    templates: {
      javascript: `function removeInvalidParentheses(s) {
  // Write your solution here
  
}

// Test your solution
console.log(removeInvalidParentheses("()())()")); // Expected: ["(())()","()()()"]
console.log(removeInvalidParentheses("(a)())()")); // Expected: ["(a())()","(a)()()"]`,
      python: `def remove_invalid_parentheses(s):
    # Write your solution here
    pass

# Test your solution
print(remove_invalid_parentheses("()())()"))   # Expected: ["(())()","()()()"]
print(remove_invalid_parentheses("(a)())()"))  # Expected: ["(a())()","(a)()()"]`,
      java: `import java.util.*;

class Solution {
    public static List<String> removeInvalidParentheses(String s) {
        // Write your solution here
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(removeInvalidParentheses("()())()"));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> removeInvalidParentheses(string s) {
    // Write your solution here
    return {};
}

int main() {
    auto result = removeInvalidParentheses("()())()");
    for (const string& str : result) cout << str << " ";
    cout << endl;
    return 0;
}`,
      typescript: `function removeInvalidParentheses(s: string): string[] {
  // Write your solution here
  return [];
}

// Test your solution
console.log(removeInvalidParentheses("()())()")); // Expected: ["(())()","()()()"]`,
    }
  },
  {
    id: "design-twitter",
    title: "Design Twitter",
    difficulty: "Hard",
    description: "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and retrieve the 10 most recent tweet ids in the user's news feed (their own tweets plus tweets from people they follow).",
    examples: [
      { input: "postTweet(1, 5), getNewsFeed(1), follow(1, 2), postTweet(2, 6), getNewsFeed(1), unfollow(1, 2), getNewsFeed(1)", output: "[5], [6,5], [5]", explanation: "Feed includes own tweets and followed users' tweets" }
    ],
    templates: {
      javascript: `class Twitter {
  constructor() {
    // Initialize your data structures
  }
  
  postTweet(userId, tweetId) {
    // User posts a tweet
  }
  
  getNewsFeed(userId) {
    // Return 10 most recent tweets from user and followed users
    return [];
  }
  
  follow(followerId, followeeId) {
    // Follower follows followee
  }
  
  unfollow(followerId, followeeId) {
    // Follower unfollows followee
  }
}

// Test your solution
const twitter = new Twitter();
twitter.postTweet(1, 5);
console.log(twitter.getNewsFeed(1)); // [5]
twitter.follow(1, 2);
twitter.postTweet(2, 6);
console.log(twitter.getNewsFeed(1)); // [6, 5]
twitter.unfollow(1, 2);
console.log(twitter.getNewsFeed(1)); // [5]`,
      python: `class Twitter:
    def __init__(self):
        # Initialize your data structures
        pass
    
    def post_tweet(self, user_id, tweet_id):
        # User posts a tweet
        pass
    
    def get_news_feed(self, user_id):
        # Return 10 most recent tweets
        return []
    
    def follow(self, follower_id, followee_id):
        # Follower follows followee
        pass
    
    def unfollow(self, follower_id, followee_id):
        # Follower unfollows followee
        pass

# Test your solution
twitter = Twitter()
twitter.post_tweet(1, 5)
print(twitter.get_news_feed(1))  # [5]
twitter.follow(1, 2)
twitter.post_tweet(2, 6)
print(twitter.get_news_feed(1))  # [6, 5]`,
      java: `import java.util.*;

class Twitter {
    public Twitter() {
        // Initialize your data structures
    }
    
    public void postTweet(int userId, int tweetId) {
        // User posts a tweet
    }
    
    public List<Integer> getNewsFeed(int userId) {
        // Return 10 most recent tweets
        return new ArrayList<>();
    }
    
    public void follow(int followerId, int followeeId) {
        // Follower follows followee
    }
    
    public void unfollow(int followerId, int followeeId) {
        // Follower unfollows followee
    }
    
    public static void main(String[] args) {
        Twitter twitter = new Twitter();
        twitter.postTweet(1, 5);
        System.out.println(twitter.getNewsFeed(1)); // [5]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Twitter {
public:
    Twitter() {
        // Initialize your data structures
    }
    
    void postTweet(int userId, int tweetId) {
        // User posts a tweet
    }
    
    vector<int> getNewsFeed(int userId) {
        // Return 10 most recent tweets
        return {};
    }
    
    void follow(int followerId, int followeeId) {
        // Follower follows followee
    }
    
    void unfollow(int followerId, int followeeId) {
        // Follower unfollows followee
    }
};

int main() {
    Twitter twitter;
    twitter.postTweet(1, 5);
    auto feed = twitter.getNewsFeed(1);
    for (int id : feed) cout << id << " ";
    cout << endl;
    return 0;
}`,
      typescript: `class Twitter {
  constructor() {
    // Initialize your data structures
  }
  
  postTweet(userId: number, tweetId: number): void {
    // User posts a tweet
  }
  
  getNewsFeed(userId: number): number[] {
    // Return 10 most recent tweets
    return [];
  }
  
  follow(followerId: number, followeeId: number): void {
    // Follower follows followee
  }
  
  unfollow(followerId: number, followeeId: number): void {
    // Follower unfollows followee
  }
}

// Test your solution
const twitter = new Twitter();
twitter.postTweet(1, 5);
console.log(twitter.getNewsFeed(1)); // [5]`,
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
