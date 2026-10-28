import { Subject } from './types';
import { SUBJECT_NAMES } from '../../config';

export const aoaShorted: Subject = {
  id: 'aoa_shorted',
  name: SUBJECT_NAMES.aoa_shorted,
  items: [
  {
    "id": "as1",
    "expNo": "1.1",
    "title": "Insertion Sort",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nint main(){\n    int a[100],n,i,j,k;\n    printf(\"Enter the array size: \"); scanf(\"%d\",&n);\n    printf(\"Enter the array elements:\\n\");\n    for(i=0;i<n;i++) scanf(\"%d\",&a[i]);\n    for(i=1;i<n;i++){\n        for(k=a[i],j=i-1;j>=0&&a[j]>k;j--) a[j+1]=a[j];\n        a[j+1]=k;\n    }\n    printf(\"Sorted Elements are:\\n\");\n    for(i=0;i<n;i++) printf(\"%d\\t\",a[i]);\n    printf(\"\\n\");\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n55 83 75 23 22",
    "savedOutput": "Enter the array size: 5\nEnter the array elements:\n55 83 75 23 22\nSorted Elements are:\n22 23 55 75 83",
    "mode": "console"
  },
  {
    "id": "as2",
    "expNo": "1.2",
    "title": "Selection Sort",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nint main(){\n    int a[100],n,i,j,l,t;\n    printf(\"Enter the array size: \"); scanf(\"%d\",&n);\n    printf(\"Enter the array elements:\\n\");\n    for(i=0;i<n;i++) scanf(\"%d\",&a[i]);\n    for(i=0;i<n-1;i++){\n        for(l=i,j=i+1;j<n;j++) if(a[j]<a[l]) l=j;\n        t=a[i]; a[i]=a[l]; a[l]=t;\n    }\n    printf(\"Sorted Elements are:\\n\");\n    for(i=0;i<n;i++) printf(\"%d\\t\",a[i]);\n    printf(\"\\n\");\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "6\n55 83 75 23 75 22",
    "savedOutput": "Enter the array size: 6\nEnter the array elements:\n55 83 75 23 75 22\nSorted Elements are:\n22 23 55 75 75 83",
    "mode": "console"
  },
  {
    "id": "as3",
    "expNo": "2",
    "title": "Binary Search",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nint main(){\n    int a[100],n,i,k,l=0,r,m,p=-1;\n    printf(\"Enter the size of array: \"); scanf(\"%d\",&n);\n    printf(\"Enter elements of array (in sorted order):\\n\");\n    for(i=0;i<n;i++) scanf(\"%d\",&a[i]);\n    printf(\"Enter the element to be searched: \"); scanf(\"%d\",&k);\n    for(r=n-1;l<=r&&p<0;){\n        m=(l+r)/2;\n        if(a[m]==k) p=m;\n        else if(k<a[m]) r=m-1;\n        else l=m+1;\n    }\n    if(p>=0) printf(\"Search is Successful, element found at index %d (Position %d)\\n\",p,p+1);\n    else printf(\"Search is Unsuccessful\\n\");\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n10 20 30 40 50\n30",
    "savedOutput": "Enter the size of array: 5\nEnter elements of array (in sorted order):\n10 20 30 40 50\nEnter the element to be searched: 30\nSearch is Successful, element found at index 2 (Position 3)",
    "mode": "console"
  },
  {
    "id": "as4",
    "expNo": "3",
    "title": "Dijkstra's Algorithm",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#define INF 9999\nint main(){\n    int n,s,c[11][11],d[11],v[11]={0},i,j,u,m;\n    printf(\"Enter the number of nodes (max 10): \"); scanf(\"%d\",&n);\n    printf(\"Enter the cost matrix (0 = no edge):\\n\");\n    for(i=1;i<=n;i++) for(j=1;j<=n;j++){\n        scanf(\"%d\",&c[i][j]);\n        if(!c[i][j]&&i!=j) c[i][j]=INF;\n    }\n    printf(\"Enter the source node: \"); scanf(\"%d\",&s);\n    for(i=1;i<=n;i++) d[i]=INF;\n    d[s]=0;\n    for(i=1;i<=n;i++){\n        for(u=0,m=INF,j=1;j<=n;j++) if(!v[j]&&d[j]<m) m=d[u=j];\n        if(!u) break;\n        v[u]=1;\n        for(j=1;j<=n;j++) if(d[u]+c[u][j]<d[j]) d[j]=d[u]+c[u][j];\n    }\n    printf(\"\\nShortest Path:\\n\");\n    for(i=1;i<=n;i++) if(i!=s){\n        printf(\"%d -> %d = \",s,i);\n        if(d[i]>=INF) printf(\"No path\\n\"); else printf(\"%d\\n\",d[i]);\n    }\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n0 10 0 30\n10 0 20 0\n0 20 0 5\n30 0 5 0\n1",
    "savedOutput": "Enter the number of nodes (max 10): 4\nEnter the cost matrix (0 = no edge):\n0 10 0 30\n10 0 20 0\n0 20 0 5\n30 0 5 0\nEnter the source node: 1\n\nShortest Path:\n1 -> 2 = 10\n1 -> 3 = 30\n1 -> 4 = 30",
    "mode": "console"
  },
  {
    "id": "as5",
    "expNo": "4",
    "title": "0/1 Knapsack Problem",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nint main(){\n    int n,M,i,j;\n    printf(\"Enter number of items: \"); scanf(\"%d\",&n);\n    int w[n+1],p[n+1];\n    printf(\"Enter weights of items:\\n\");\n    for(i=1;i<=n;i++) scanf(\"%d\",&w[i]);\n    printf(\"Enter profits of items:\\n\");\n    for(i=1;i<=n;i++) scanf(\"%d\",&p[i]);\n    printf(\"Enter Knapsack Capacity: \"); scanf(\"%d\",&M);\n    int V[n+1][M+1];\n    printf(\"\\nDP Table:\\n\");\n    for(i=0;i<=n;i++,printf(\"\\n\")) for(j=0;j<=M;j++){\n        V[i][j]=i?V[i-1][j]:0;\n        if(i&&w[i]<=j&&p[i]+V[i-1][j-w[i]]>V[i][j]) V[i][j]=p[i]+V[i-1][j-w[i]];\n        printf(\"%d\\t\",V[i][j]);\n    }\n    printf(\"\\nMaximum Profit = %d\\n\\nSelected Items:\\n\",V[n][M]);\n    for(i=n,j=M;i>0;i--) if(V[i][j]!=V[i-1][j]){\n        printf(\"Item %d (Weight=%d, Profit=%d)\\n\",i,w[i],p[i]); j-=w[i];\n    }\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n2 3 4 5\n1 2 5 6\n8",
    "savedOutput": "Enter number of items: 4\nEnter weights of items:\n2 3 4 5\nEnter profits of items:\n1 2 5 6\nEnter Knapsack Capacity: 8\n\nDP Table:\n0\t0\t0\t0\t0\t0\t0\t0\t0\t\n0\t0\t1\t1\t1\t1\t1\t1\t1\t\n0\t0\t1\t2\t2\t3\t3\t3\t3\t\n0\t0\t1\t2\t5\t5\t6\t7\t7\t\n0\t0\t1\t2\t5\t6\t6\t7\t8\t\n\nMaximum Profit = 8\n\nSelected Items:\nItem 4 (Weight=5, Profit=6)\nItem 2 (Weight=3, Profit=2)",
    "mode": "console"
  },
  {
    "id": "as6",
    "expNo": "5",
    "title": "Longest Common Subsequence",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\nint main(){\n    char X[100],Y[100],L[100]; int d[100][100],m,n,i,j,k;\n    printf(\"Enter first string: \"); scanf(\"%99s\",X);\n    printf(\"Enter second string: \"); scanf(\"%99s\",Y);\n    m=strlen(X); n=strlen(Y);\n    printf(\"\\nDP Matrix:\\n\");\n    for(i=0;i<=m;i++,printf(\"\\n\")) for(j=0;j<=n;j++){\n        d[i][j]=(!i||!j)?0:X[i-1]==Y[j-1]?d[i-1][j-1]+1:\n            d[i-1][j]>d[i][j-1]?d[i-1][j]:d[i][j-1];\n        printf(\"%2d \",d[i][j]);\n    }\n    k=d[m][n]; L[k]=0;\n    for(i=m,j=n;i&&j;)\n        if(X[i-1]==Y[j-1]) L[--k]=X[--i],j--;\n        else if(d[i-1][j]>=d[i][j-1]) i--; else j--;\n    printf(\"\\nLength of LCS = %d\\nLCS = %s\\n\",d[m][n],L);\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "ABCBDAB\nBDCABA",
    "savedOutput": "Enter first string: ABCBDAB\nEnter second string: BDCABA\n\nDP Matrix:\n 0  0  0  0  0  0  0 \n 0  0  0  0  1  1  1 \n 0  1  1  1  1  2  2 \n 0  1  1  2  2  2  2 \n 0  1  1  2  2  3  3 \n 0  1  2  2  2  3  3 \n 0  1  2  2  3  3  4 \n 0  1  2  2  3  4  4 \n\nLength of LCS = 4\nLCS = BCBA",
    "mode": "console"
  },
  {
    "id": "as7",
    "expNo": "6",
    "title": "BFS & DFS Graph Traversals",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nint a[20][20],v[20],n;\nvoid dfs(int s){\n    int i; v[s]=1; printf(\" %d\",s);\n    for(i=1;i<=n;i++) if(a[s][i]&&!v[i]) dfs(i);\n}\nvoid bfs(int s){\n    int q[20],f=0,r=0,i; q[r++]=s; v[s]=1;\n    while(f<r){\n        s=q[f++]; printf(\" %d\",s);\n        for(i=1;i<=n;i++) if(a[s][i]&&!v[i]) v[i]=1,q[r++]=i;\n    }\n}\nint main(){\n    int i,j,s,c; char y;\n    printf(\"Enter the number of vertices: \"); scanf(\"%d\",&n);\n    printf(\"Enter the adjacency matrix:\\n\");\n    for(i=1;i<=n;i++) for(j=1;j<=n;j++) scanf(\"%d\",&a[i][j]);\n    do{\n        for(i=1;i<=n;i++) v[i]=0;\n        printf(\"\\nMENU\\n1. B.F.S\\n2. D.F.S\\nEnter your choice: \"); scanf(\"%d\",&c);\n        printf(\"Enter the source vertex: \"); scanf(\"%d\",&s);\n        printf(c==1?\"BFS order:\":\"DFS order:\");\n        if(c==1) bfs(s); else dfs(s);\n        printf(\"\\n\\nDo you want to continue (Y/N)? \"); scanf(\" %c\",&y);\n    }while(y=='y'||y=='Y');\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4\n0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0\n1\n1\ny\n2\n1\nn",
    "savedOutput": "Enter the number of vertices: 4\nEnter the adjacency matrix:\n0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0\n\nMENU\n1. B.F.S\n2. D.F.S\nEnter your choice: 1\nEnter the source vertex: 1\nBFS order: 1 2 3 4\n\nDo you want to continue (Y/N)? y\n\nMENU\n1. B.F.S\n2. D.F.S\nEnter your choice: 2\nEnter the source vertex: 1\nDFS order: 1 2 4 3\n\nDo you want to continue (Y/N)? n",
    "mode": "console"
  },
  {
    "id": "as8",
    "expNo": "7",
    "title": "N-Queen Problem",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <stdlib.h>\nint c[20],n,k;\nint safe(int r,int x){\n    for(int i=0;i<r;i++) if(c[i]==x||abs(c[i]-x)==r-i) return 0;\n    return 1;\n}\nvoid solve(int r){\n    int i,j;\n    if(r==n){\n        printf(\"\\nSolution %d:\\n\",++k);\n        for(i=0;i<n;i++,printf(\"\\n\")) for(j=0;j<n;j++) printf(\"%d \",c[i]==j);\n        return;\n    }\n    for(i=0;i<n;i++) if(safe(r,i)) c[r]=i,solve(r+1);\n}\nint main(){\n    printf(\"Enter number of queens: \"); scanf(\"%d\",&n);\n    solve(0); printf(\"\\nTotal possible ways: %d\\n\",k);\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "4",
    "savedOutput": "Enter number of queens: 4\n\nSolution 1:\n0 1 0 0 \n0 0 0 1 \n1 0 0 0 \n0 0 1 0 \n\nSolution 2:\n0 0 1 0 \n1 0 0 0 \n0 0 0 1 \n0 1 0 0 \n\nTotal possible ways: 2",
    "mode": "console"
  },
  {
    "id": "as9",
    "expNo": "8",
    "title": "15 Puzzle using Branch and Bound",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\n#define MAX 20000\ntypedef struct{int m[16],z,g,o;}T;\nT p[MAX];\nint h(int*m){int i,c=0;for(i=0;i<16;i++) c+=m[i]&&m[i]!=(i+1)%16;return c;}\nint main(){\n    int s[16]={1,2,3,4,5,6,0,8,9,10,7,11,13,14,15,12};\n    int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1},n=1,i,k,b,r,q,z; T c,x;\n    memcpy(p[0].m,s,sizeof s); p[0].o=1;\n    for(i=0;i<16;i++) if(!s[i]) p[0].z=i;\n    while(1){\n        for(b=-1,i=0;i<n;i++) if(p[i].o&&(b<0||p[i].g+h(p[i].m)<p[b].g+h(p[b].m))) b=i;\n        if(b<0||n>MAX-4) return printf(\"Solution not found.\\n\"),0;\n        c=p[b]; p[b].o=0;\n        if(!h(c.m)){\n            printf(\"Solution found at level %d:\\n\",c.g);\n            for(i=0;i<16;i++) printf(\"%2d%s\",c.m[i],i%4==3?\"\\n\":\" \");\n            return 0;\n        }\n        for(k=0;k<4;k++){\n            r=c.z/4+dr[k]; q=c.z%4+dc[k];\n            if((unsigned)r>3||(unsigned)q>3) continue;\n            z=r*4+q; x=c; x.m[c.z]=x.m[z]; x.m[z]=0; x.z=z; x.g++; x.o=1;\n            for(i=0;i<n&&memcmp(p[i].m,x.m,sizeof x.m);i++);\n            if(i==n) p[n++]=x;\n        }\n    }\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "",
    "savedOutput": "Solution found at level 3:\n 1  2  3  4\n 5  6  7  8\n 9 10 11 12\n13 14 15  0",
    "mode": "console"
  },
  {
    "id": "as10",
    "expNo": "9",
    "title": "Naive String Matching",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\n#include <string.h>\nint main(){\n    char t[100],p[100]; int n,m,i,f=0;\n    printf(\"Enter the text: \"); scanf(\" %99[^\\n]\",t);\n    printf(\"Enter the pattern to search for: \"); scanf(\" %99[^\\n]\",p);\n    n=strlen(t); m=strlen(p);\n    for(i=0;i+m<=n;i++) if(!strncmp(t+i,p,m)) printf(\"Pattern found at index %d\\n\",i),f=1;\n    if(!f) printf(\"Pattern not found in the text.\\n\");\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "AABAACAADAABAABA\nAABA",
    "savedOutput": "Enter the text: AABAACAADAABAABA\nEnter the pattern to search for: AABA\nPattern found at index 0\nPattern found at index 9\nPattern found at index 12",
    "mode": "console"
  },
  {
    "id": "as11",
    "expNo": "10",
    "title": "Min-Max Algorithm",
    "language": "c",
    "files": [
      {
        "name": "main.c",
        "code": "#include <stdio.h>\nvoid minmax(int a[],int l,int h,int*mn,int*mx){\n    int m,x,y;\n    if(l==h) *mn=*mx=a[l];\n    else if(h==l+1){*mn=a[l]<a[h]?a[l]:a[h]; *mx=a[l]<a[h]?a[h]:a[l];}\n    else{\n        m=(l+h)/2; minmax(a,l,m,mn,mx); minmax(a,m+1,h,&x,&y);\n        if(x<*mn) *mn=x;\n        if(y>*mx) *mx=y;\n    }\n}\nint main(){\n    int a[100],n,i,mn,mx;\n    printf(\"Enter size of array (max 100): \"); scanf(\"%d\",&n);\n    printf(\"Enter elements of the array:\\n\");\n    for(i=0;i<n;i++) scanf(\"%d\",&a[i]);\n    minmax(a,0,n-1,&mn,&mx);\n    printf(\"Maximum element: %d\\nMinimum element: %d\\n\",mx,mn);\n}"
      }
    ],
    "mainFile": "main.c",
    "sampleInput": "5\n5 4 23 1 50",
    "savedOutput": "Enter size of array (max 100): 5\nEnter elements of the array:\n5 4 23 1 50\nMaximum element: 50\nMinimum element: 1",
    "mode": "console"
  }
]
};
