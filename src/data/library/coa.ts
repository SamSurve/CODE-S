import { Subject } from './types';
import { SUBJECT_NAMES } from '../../config';

export const coa: Subject = {
  id: 'coa',
  name: SUBJECT_NAMES.coa,
  items: [
    {
      id: 'c1',
      expNo: '',
      title: 'Password Detection Application',
      language: 'asm',
      files: [
        {
          name: 'main.asm',
          code: `; EXP : Password Detection Application
org 100h

lea dx, prompt
mov ah, 09h
int 21h

lea dx, buf
mov ah, 0Ah
int 21h

lea si, pass
lea di, [buf+2]
mov cx, 5
check_loop:
    mov al, [si]
    mov bl, [di]
    cmp al, bl
    jne not_matched
    inc si
    inc di
    loop check_loop

mov al, [di]          ; next char must be Enter (0Dh)
cmp al, 0Dh
jne not_matched

lea dx, msg_matched
jmp print

not_matched:
lea dx, msg_unmatched

print:
mov ah, 09h
int 21h
hlt

prompt db 'Enter Password: $'
pass db 'TOMMY'
buf db 6, 0, 6 dup(0)
msg_matched db 0dh, 0ah, 'Password Matched$'
msg_unmatched db 0dh, 0ah, 'Password does not match$'`
        }
      ],
      mainFile: 'main.asm',
      sampleInput: 'TOMMY',
      savedOutput: `Enter Password: TOMMY\n\nPassword Matched\n[CPU Halted (HLT)]`,
      mode: 'static'
    },
    {
      id: 'c2',
      expNo: '',
      title: 'Logic Gates',
      language: 'asm',
      files: [
        {
          name: 'main.asm',
          code: `; EXP : Logic Gates
org 100h
mov al, 4bh
mov bl, 15h
mov ah, al
and ah, bl
mov [0200h], ah  ; AND
mov ah, al
or ah, bl
mov [0201h], ah  ; OR
mov ah, al
xor ah, bl
mov [0202h], ah  ; XOR
mov ah, al
not ah
mov [0203h], ah  ; NOT
mov ah, [0200h]
not ah
mov [0204h], ah  ; NAND
mov ah, [0201h]
not ah
mov [0205h], ah  ; NOR
mov ah, [0202h]
not ah
mov [0206h], ah  ; XNOR
lea dx, msg
mov ah, 09h
int 21h
hlt
msg db 'All 7 Logic Gates Executed $'`
        }
      ],
      mainFile: 'main.asm',
      sampleInput: '',
      savedOutput: `All 7 Logic Gates Executed`,
      mode: 'static'
    },
    {
      id: 'c3',
      expNo: '',
      title: 'Bubble Sort',
      language: 'asm',
      files: [
        {
          name: 'main.asm',
          code: `; EXP : Bubble Sort

org 100h
mov bx,4
L1: mov cx,4
    mov si,0
L2: mov al,[A+si]
    cmp al,[A+si+1]
    jbe L3
    xchg al,[A+si+1]
    mov [A+si],al
L3: inc si
    loop L2
    dec bx
    jnz L1

mov si,0
mov cx,5
L4: mov al,[A+si]
    mov ah,0
    mov dl,10
    div dl
    mov dh,ah
    add al,30h
    mov dl,al
    mov ah,02h
    int 21h
    add dh,30h
    mov dl,dh
    mov ah,02h
    int 21h
    mov dl,' '
    int 21h
    inc si
    loop L4
hlt

A db 45,12,67,8,21`
        }
      ],
      mainFile: 'main.asm',
      sampleInput: '',
      savedOutput: `08 12 21 45 67`,
      mode: 'static'
    },
    {
      id: 'c4',
      expNo: '',
      title: 'Booth Multiplication',
      language: 'asm',
      files: [
        {
          name: 'main.asm',
          code: `; EXP : Booth Multiplication

org 100h
mov dx,msg1
mov ah,09h
int 21h
mov ah,01h
int 21h
sub al,30h
mov bl,al          ; M
mov dx,msg2
mov ah,09h
int 21h
mov ah,01h
int 21h
sub al,30h
mov dh,al          ; Q
mov bh,0           ; A
mov ch,0           ; Q-1
mov cl,8

L1: mov al,dh
    and al,1       ; Q0
    cmp al,ch
    je SH          ; 00 or 11: no change
    cmp al,1
    je SB          ; 10: A = A - M
    add bh,bl      ; 01: A = A + M
    jmp SH
SB: sub bh,bl
SH: mov ch,al      ; Q-1 = Q0
    sar bh,1       ; shift A, CF = A0
    rcr dh,1       ; shift Q, A0 goes in
    loop L1

mov al,dh
mov ah,0
mov bl,10
div bl
mov bx,ax          ; BL = tens, BH = ones
mov dx,res
mov ah,09h
int 21h
add bl,30h
mov dl,bl
mov ah,02h
int 21h
add bh,30h
mov dl,bh
mov ah,02h
int 21h
hlt

msg1 db 'Enter Multiplicand: $'
msg2 db 13,10,'Enter Multiplier: $'
res  db 13,10,'Booth Result = $'`
        }
      ],
      mainFile: 'main.asm',
      sampleInput: '6\n7',
      savedOutput: `Enter Multiplicand: 6\nEnter Multiplier: 7\nBooth Result = 42\n[CPU Halted (HLT)]`,
      mode: 'static'
    }
  ]
};
