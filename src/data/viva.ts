export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface VivaPracticalData {
  aim: string;
  howItWorks: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  vivaQuestions: VivaQuestion[];
}

export const VIVA_DATA: Record<string, VivaPracticalData> = {
  'insertion-sort': {
    aim: 'To implement and analyze the Insertion Sort algorithm in C for sorting an array in ascending order.',
    howItWorks: [
      'Divide the array into a sorted sublist on the left and an unsorted sublist on the right.',
      'Pick the next element (key) from the unsorted section.',
      'Shift all sorted elements greater than the key one position to the right.',
      'Insert the key into its correct sorted position.',
      'Repeat until all unsorted elements are placed in order.'
    ],
    timeComplexity: {
      best: 'O(n) (already sorted array)',
      average: 'O(n²)',
      worst: 'O(n²) (reverse sorted array)'
    },
    spaceComplexity: 'O(1) auxiliary space (in-place)',
    vivaQuestions: [
      {
        question: 'What makes Insertion Sort adaptive and stable?',
        answer: 'It is adaptive because its runtime drops to O(n) on already-sorted arrays; it is stable because equal elements never swap places.'
      },
      {
        question: 'When is Insertion Sort preferred over Merge Sort or Quick Sort?',
        answer: 'For small datasets (typically n < 20) or nearly sorted lists, due to low overhead and cache locality.'
      },
      {
        question: 'What is the maximum number of comparisons in the worst case?',
        answer: 'n(n - 1) / 2 comparisons, which occurs when the input array is sorted in reverse order.'
      },
      {
        question: 'Is Insertion Sort an online algorithm?',
        answer: 'Yes, it can sort an incoming stream of numbers in real time as each element arrives.'
      }
    ]
  },

  'selection-sort': {
    aim: 'To implement and analyze the Selection Sort algorithm in C for arranging elements in ascending order.',
    howItWorks: [
      'Assume the element at index i is the minimum element (loc = i).',
      'Scan the remaining unsorted subarray from j = i + 1 to n - 1.',
      'If any element a[j] is smaller than a[loc], update loc = j.',
      'Swap the found minimum a[loc] with the element at position i.',
      'Advance index i and repeat until all n - 1 passes are complete.'
    ],
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²) (always performs n(n-1)/2 comparisons regardless of initial order)'
    },
    spaceComplexity: 'O(1) auxiliary space (in-place)',
    vivaQuestions: [
      {
        question: 'Why is the best-case time complexity of Selection Sort O(n²)?',
        answer: 'Because the algorithm always scans through the entire unsorted subarray to find the minimum in every pass.'
      },
      {
        question: 'How many swaps does Selection Sort perform in the worst case?',
        answer: 'At most n - 1 swaps (O(n)), making it advantageous when memory write operations are costly.'
      },
      {
        question: 'Is standard Selection Sort stable?',
        answer: 'No, long-range swaps can alter the relative order of duplicate elements (e.g., [4a, 4b, 1] becomes [1, 4b, 4a]).'
      },
      {
        question: 'What design paradigm does Selection Sort follow?',
        answer: 'Brute-force / greedy approach by repeatedly taking the smallest available element.'
      }
    ]
  },

  'binary-search': {
    aim: 'To implement and analyze Binary Search on a sorted array using Divide and Conquer.',
    howItWorks: [
      'Calculate the midpoint index: mid = low + (high - low) / 2.',
      'If a[mid] equals the target key, return mid (element found).',
      'If key < a[mid], search the left half by setting high = mid - 1.',
      'If key > a[mid], search the right half by setting low = mid + 1.',
      'If low > high, search ends unsuccessfully (element not found).'
    ],
    timeComplexity: {
      best: 'O(1) (target element is at initial middle position)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1) auxiliary space (iterative) or O(log n) call stack (recursive)',
    vivaQuestions: [
      {
        question: 'What is the necessary prerequisite for applying Binary Search?',
        answer: 'The input collection must be sorted in monotonic order (ascending or descending).'
      },
      {
        question: 'Why write `mid = low + (high - low) / 2` instead of `(low + high) / 2`?',
        answer: 'To prevent arithmetic integer overflow when `low + high` exceeds INT_MAX.'
      },
      {
        question: 'What recurrence relation describes Binary Search?',
        answer: 'T(n) = T(n/2) + O(1), which evaluates to O(log n) via the Master Theorem.'
      },
      {
        question: 'Can Binary Search run in O(log n) on a singly linked list?',
        answer: 'No, because linked lists lack O(1) random indexing; finding the middle node takes O(n).'
      }
    ]
  },

  'dijkstra': {
    aim: 'To find the shortest paths from a single source vertex to all other vertices in a weighted graph using Dijkstra\'s algorithm.',
    howItWorks: [
      'Initialize distance to source as 0 and all other vertices as infinity; visited set is empty.',
      'Select the unvisited vertex u with the minimum current distance.',
      'Mark vertex u as visited (finalized).',
      'Relax each unvisited neighbor v: if dist[u] + cost(u, v) < dist[v], update dist[v].',
      'Repeat until all reachable vertices are visited.'
    ],
    timeComplexity: {
      best: 'O(V²) with adjacency matrix; O((V + E) log V) with min-heap',
      average: 'O(V²) with matrix; O((V + E) log V) with min-heap',
      worst: 'O(V²) with matrix; O((V + E) log V) with min-heap'
    },
    spaceComplexity: 'O(V) auxiliary space for distance and visited tracking (plus graph storage)',
    vivaQuestions: [
      {
        question: 'Why does Dijkstra\'s algorithm fail with negative edge weights?',
        answer: 'It assumes that once a vertex is marked visited its shortest path is settled, which is invalidated if a negative weight reduces it later.'
      },
      {
        question: 'What algorithmic paradigm does Dijkstra\'s algorithm use?',
        answer: 'The Greedy method, greedily choosing the unvisited node with minimum tentative distance.'
      },
      {
        question: 'Which algorithm handles graphs with negative edge weights?',
        answer: 'The Bellman-Ford algorithm (O(V · E)), which can also detect negative weight cycles.'
      },
      {
        question: 'How does Dijkstra\'s algorithm differ from Prim\'s algorithm?',
        answer: 'Dijkstra minimizes cumulative path distance from a single source, whereas Prim minimizes the weight of connecting to the spanning tree.'
      }
    ]
  },

  'knapsack-01': {
    aim: 'To solve the 0/1 Knapsack problem using Dynamic Programming to maximize profit without exceeding capacity.',
    howItWorks: [
      'Construct a 2D DP table K[n+1][W+1] where K[i][w] represents max value using first i items and capacity w.',
      'Initialize base cases: row 0 (0 items) and column 0 (0 capacity) to 0.',
      'For each item i with weight wt[i-1] and profit val[i-1]:',
      'If wt[i-1] <= w, K[i][w] = max(val[i-1] + K[i-1][w - wt[i-1]], K[i-1][w]).',
      'Otherwise, item cannot fit: K[i][w] = K[i-1][w]. The optimal value is at K[n][W].'
    ],
    timeComplexity: {
      best: 'O(n · W)',
      average: 'O(n · W)',
      worst: 'O(n · W) (pseudo-polynomial in capacity W)'
    },
    spaceComplexity: 'O(n · W) for 2D DP table (can be optimized to O(W) using 1D rolling array)',
    vivaQuestions: [
      {
        question: 'Why is 0/1 Knapsack classified as pseudo-polynomial time?',
        answer: 'Because its time complexity depends on the numeric value of W, which is exponential in the number of bits required to represent W.'
      },
      {
        question: 'Why does the Greedy method fail for 0/1 Knapsack?',
        answer: 'Items cannot be broken into fractions; choosing items by highest value/weight ratio can leave wasted slack capacity.'
      },
      {
        question: 'What is the difference between 0/1 and Fractional Knapsack?',
        answer: 'In 0/1 Knapsack items are indivisible (Dynamic Programming), whereas in Fractional Knapsack items can be divided (Greedy).'
      },
      {
        question: 'How are the selected items recovered from the DP table?',
        answer: 'If K[i][w] != K[i-1][w], item i was picked; subtract its weight wt[i-1] from w and move to row i - 1.'
      }
    ]
  },

  'longest-common-subsequence': {
    aim: 'To find the length and characters of the Longest Common Subsequence of two strings using Dynamic Programming.',
    howItWorks: [
      'Create a DP table L[m+1][n+1] initialized to 0 for strings X of length m and Y of length n.',
      'Iterate through all pairs of characters X[i-1] and Y[j-1].',
      'If X[i-1] == Y[j-1], characters match: set L[i][j] = 1 + L[i-1][j-1].',
      'Else mismatch: take the maximum of excluding one character: max(L[i-1][j], L[i][j-1]).',
      'L[m][n] gives the LCS length; backtrack through the table to reconstruct the LCS string.'
    ],
    timeComplexity: {
      best: 'O(m · n)',
      average: 'O(m · n)',
      worst: 'O(m · n)'
    },
    spaceComplexity: 'O(m · n) for DP table (can be optimized to O(min(m, n)) for length only)',
    vivaQuestions: [
      {
        question: 'What is the difference between a substring and a subsequence?',
        answer: 'A substring requires contiguous characters, while a subsequence maintains relative order without needing to be contiguous.'
      },
      {
        question: 'What two properties make LCS solvable with Dynamic Programming?',
        answer: 'Optimal substructure (solution built from optimal subproblems) and overlapping subproblems.'
      },
      {
        question: 'What is the time complexity of the naive brute-force LCS approach?',
        answer: 'O(2^m · n), because a string of length m has 2^m distinct subsequences.'
      },
      {
        question: 'Mention two practical applications of LCS.',
        answer: 'File difference utilities (e.g. `git diff`) and bioinformatics for DNA/protein sequence alignment.'
      }
    ]
  },

  'graph-coloring': {
    aim: 'To color vertices of a graph with at most m colors such that no two adjacent vertices share the same color using Backtracking.',
    howItWorks: [
      'Start with vertex 0 and attempt assigning colors from 1 to m.',
      'For each color, call isSafe() to verify that no adjacent vertex currently has the same color.',
      'If safe, assign the color and recursively advance to vertex k + 1.',
      'If no color works for subsequent vertices, backtrack: reset current color to 0 and try the next color.',
      'Print all valid colorings or report if no assignment is possible.'
    ],
    timeComplexity: {
      best: 'O(V) (if initial assignment immediately succeeds)',
      average: 'O(m^V)',
      worst: 'O(m^V) (exponential search tree exploring up to m colors for V vertices)'
    },
    spaceComplexity: 'O(V) auxiliary space for color array and recursion call stack',
    vivaQuestions: [
      {
        question: 'What is the chromatic number of a graph?',
        answer: 'The minimum number of colors required to color the graph such that no two adjacent vertices share the same color.'
      },
      {
        question: 'What does the Four Color Theorem state?',
        answer: 'Any planar graph can be colored with at most 4 colors such that no adjacent regions share the same color.'
      },
      {
        question: 'Is determining graph m-colorability NP-Complete?',
        answer: 'Yes, determining whether a general graph can be colored using m >= 3 colors is NP-Complete.'
      },
      {
        question: 'What does the isSafe() check verify?',
        answer: 'It checks the graph\'s adjacency matrix to ensure no adjacent vertex already has the proposed color.'
      }
    ]
  },

  'n-queens': {
    aim: 'To place N queens on an N×N chessboard so that no two queens attack each other using Backtracking.',
    howItWorks: [
      'Place queens row by row starting from row 0.',
      'In the current row, try placing a queen in each column from 0 to N - 1.',
      'Check isSafe(): ensure no queen already exists in the same column or along both diagonal lines.',
      'If safe, place the queen (board[row][col] = 1) and recurse to row + 1.',
      'If the next placement fails, backtrack: remove queen (board[row][col] = 0) and try the next column.'
    ],
    timeComplexity: {
      best: 'O(N) (first path leads directly to solution)',
      average: 'O(N!)',
      worst: 'O(N!) (explores permutations of columns with diagonal pruning)'
    },
    spaceComplexity: 'O(N) auxiliary space for board representation and recursion depth',
    vivaQuestions: [
      {
        question: 'How many distinct solutions exist for 4-Queens and 8-Queens?',
        answer: '4-Queens has 2 solutions; 8-Queens has 92 total solutions (12 unique fundamental solutions).'
      },
      {
        question: 'Why does isSafe() only need to check columns and diagonals, not rows?',
        answer: 'Because our algorithm places exactly one queen per row by advancing row by row.'
      },
      {
        question: 'What formula detects if two queens at (r1, c1) and (r2, c2) share a diagonal?',
        answer: 'They share a diagonal if `abs(r1 - r2) == abs(c1 - c2)`.'
      },
      {
        question: 'For which board sizes N > 1 does no solution exist?',
        answer: 'N = 2 and N = 3 have no valid queen placements.'
      }
    ]
  },

  '15-puzzle': {
    aim: 'To solve the 15-Puzzle sliding tile problem using Branch and Bound with a misplaced tile heuristic.',
    howItWorks: [
      'Represent puzzle states as nodes containing the 4x4 board, blank tile position, and path cost g.',
      'Evaluate each state using f(x) = g(x) + h(x), where h(x) counts misplaced non-blank tiles.',
      'From the active node, slide the blank space in all valid directions (up, down, left, right).',
      'Compute f(x) for each child state and add valid unvisited states to the node pool.',
      'Always expand the node with the minimum f(x) (Least Cost Search) until h(x) == 0 (goal state).'
    ],
    timeComplexity: {
      best: 'O(d) where d is solution depth',
      average: 'O(b^d) where b is effective branching factor (~2 to 3)',
      worst: 'O(4^d) exponential in depth'
    },
    spaceComplexity: 'O(b^d) memory to store generated states in the priority search pool',
    vivaQuestions: [
      {
        question: 'What heuristic function h(x) is used in this program?',
        answer: 'The misplaced tile count: the number of tiles not in their target goal positions {1,2,3...15,0}.'
      },
      {
        question: 'Why is Manhattan distance superior to the misplaced tile heuristic?',
        answer: 'Manhattan distance accounts for distance each tile must travel, giving a tighter lower bound with far fewer state expansions.'
      },
      {
        question: 'How does Branch and Bound differ from Backtracking?',
        answer: 'Branch and Bound uses BFS/priority queue to find optimal solutions in optimization problems; Backtracking uses DFS.'
      },
      {
        question: 'Are all initial 15-puzzle configurations solvable?',
        answer: 'No, exactly 50% are solvable due to the invariant parity of permutation inversions plus blank row offset.'
      }
    ]
  },

  'naive-string-matching': {
    aim: 'To implement and analyze the Naive String Matching algorithm in C to locate all pattern occurrences in a text.',
    howItWorks: [
      'Slide pattern P of length m over text T of length n across all valid shifts s = 0 to n - m.',
      'At shift s, compare pattern characters P[j] with text characters T[s + j] from j = 0 to m - 1.',
      'If all m characters match, print shift s as a successful match position.',
      'If a mismatch occurs, advance shift s by 1 and restart comparison from index 0 of pattern.',
      'Repeat until all n - m + 1 potential shifts are examined.'
    ],
    timeComplexity: {
      best: 'O(n) (mismatch on the first character for every shift)',
      average: 'O(n + m) for random natural text alphabets',
      worst: 'O((n - m + 1) · m) ≈ O(n · m) (e.g. text="AAAAAAAA" and pattern="AAAB")'
    },
    spaceComplexity: 'O(1) auxiliary space (in-place comparison with no lookup tables)',
    vivaQuestions: [
      {
        question: 'What is the worst-case scenario for Naive String Matching?',
        answer: 'When both text and pattern have highly repetitive characters (e.g. text="AAAAAAAAAA", pattern="AAAB"), taking m comparisons per shift.'
      },
      {
        question: 'How does the KMP algorithm improve upon Naive matching?',
        answer: 'KMP precomputes a `pi` (LPS) array to shift the pattern without re-comparing already matched characters, achieving O(n + m) time.'
      },
      {
        question: 'How many total shifts does the algorithm examine?',
        answer: 'At most `n - m + 1` shifts.'
      },
      {
        question: 'Does Naive String Matching require any pre-processing time?',
        answer: 'No, pre-processing time is 0 and auxiliary space is O(1).'
      }
    ]
  },

  'min-max-divide-conquer': {
    aim: 'To find the minimum and maximum elements in an array using the Divide and Conquer approach.',
    howItWorks: [
      'Base Case 1: If array has 1 element (low == high), both min and max equal that single element.',
      'Base Case 2: If array has 2 elements, compare them once to assign min and max in 1 comparison.',
      'Divide: Split the array at mid = (low + high) / 2 into left and right halves.',
      'Conquer: Recursively compute (min1, max1) for left half and (min2, max2) for right half.',
      'Combine: Set min = min(min1, min2) and max = max(max1, max2).'
    ],
    timeComplexity: {
      best: '3n/2 - 2 comparisons ≈ O(n)',
      average: '3n/2 - 2 comparisons ≈ O(n)',
      worst: '3n/2 - 2 comparisons ≈ O(n)'
    },
    spaceComplexity: 'O(log n) auxiliary stack space for recursion',
    vivaQuestions: [
      {
        question: 'How many comparisons does Divide & Conquer use compared to a linear scan?',
        answer: 'It uses 3n/2 - 2 comparisons, whereas a naive linear scan uses 2n - 2 comparisons in the worst case.'
      },
      {
        question: 'What is the recurrence relation for this algorithm?',
        answer: 'T(n) = 2T(n/2) + 2 for n > 2 with base cases T(1) = 0 and T(2) = 1.'
      },
      {
        question: 'Why does it require exactly 3n/2 - 2 comparisons when n is a power of 2?',
        answer: 'Pairs of elements are compared in n/2 comparisons, then winners compete for max (n/2 - 1) and losers for min (n/2 - 1).'
      },
      {
        question: 'Can any comparison-based algorithm find min and max in less than Ω(n) time on an unsorted array?',
        answer: 'No, every element must be examined at least once to determine if it is the extremum, giving a lower bound of Ω(n).'
      }
    ]
  }
};
