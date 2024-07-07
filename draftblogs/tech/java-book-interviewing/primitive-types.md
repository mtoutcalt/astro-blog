* int is 32 bits in Java



Example 1 -----------
public static short countBits(int x) {
    short numSetBits = 0;
    while (x != 0 ) { //stop when the integer has no more set bits
        numSetBits += ( x & 1); //bitwise AND, isolate the LSB of x, will be 0 or 1 (which adds to the count)
        x >>>= 1; //right shit op, removes the LSB that was calculated, shift to the right and discard the LSB (least sig bit)
    }
    return numSetBits;
}
-------------------
* bit shifting - in this case just to iterate, its not actually shifting and manipulating bits, >>>= is the unsigned right shift operator
* bit masking - the bitwise AND is bit masking because 0110 & 0001 ensures only the LSB is checked
* O(n) where n is number of bits
* worst case is 11111.... best case is 0
* input= an int, output= number of set bits (1)
* x = 6, 0110, loop through each LBS, increment if 1, rightshift so it becomes 011 next loop, terminate when its 0
* (x & 1), this is the bitwise AND, so if x = 6, then if we use binary it would be "0110 & 0001" which is why only the LSB is checked each time since all other checks will be 0


* Know the difference between primitive and box types (Integer, Double) and autoboxing

Bit-wise operators----
* 6&4----> AND --- 2^1 + 2^2 & 2^2 ------ 0110&0100 ------- 0100
* 1|2 ----> OR ----- 0001| 0010 = 0011
* 8>>1 ----> 1000>>1 ------ right shift op ------ 0100 = 4
* -16>>>2 ----> unsigned right shift? ---- use twos complement for negative number --- 11110000 - shift 2 --- 00111100 = 12, but the leftmost 1s are negative in twos complement
* 1<<10 ---- left shift -- equal to 2^10 = 1024 ----- you can use this to do 2^n ops --- 10000000000
* ~0 --- bitwise NOT --- flipts all the bits --- 00000000 flipped is 11111111 - useful for masking

Two's complement-----
* represent signed integers in binary
* neagtive numbers
1) flip all the bits --- ex. 0101 becomes 1010
2) Add 1 (001) to the previous result === 1010 + 0001 = 1011 ---> so while 5 is 0101, -5 is 1011
    * All negative numbers have a MSB/leading bit of 1...the leftmost bit is the signed bit (1 means negative)
    * For subtraction with a negative number, take the twos complement and then add that instead
    * 0 is always 0 - no signs


* XOR in java
5 ^ 3 --- 0101 ^ 0011 = 1 if both are the same --- 0101

* constants -- Integer.MIN_VALUE, FLOAT.MAX_VALUE, Double.SIZE, Boolean.TRUE
* Why does Character[] c = new char[]{'a', 'b'} no compile?
 - new char[] is mixing primitive and Boxed types
 - new is used for creating objects not arrays
 - corrected code char[] c = {'a', 'b'} or Character[] c = new Character[]{'a', 'b'};

 * Random -- -nextInt(), nextBoolean(), nextDouble()


 Masks -----
* binary value used to isolate specific bits 
* use the bitwise AND, you can isolate only the '1' in the bit
* & = AND
* | = OR
* ~ = NOT
* used for memory effienciency, you can extract specific bits, clear specific bits, can replace parts of the bits for privacy or image manipulation

Example - isolate lower 4 bits of 16 bit integer (short in java)
final short MASK = 0b000_1111;
short data = 255; //all bits will be 1s
short isoaltedLowerBits = data & MASK; // only the 4 LSB will be 1 in MASK so it everything else will be 0000


Question 2-------
How do you compute the parity of a large number of 64-bit words?

* parity of a bit - it has are the '1s' in the word even, then its 0, if they are odd then parity = 1

brute force----
public static short parity(long x) {
    short result = 0;
    while (x != 0) {
        result ^= (x & 1); // the AND will isolate the LSB, ^ is XOR beween the result and the LSB, if they are different then if flips the bit
        x >>>= 1;  //unsigned right shift, remove the LSB that was operated on
    }
    return result;
}

* The XOR will flip to 0 each time theres been a pair or even number of bits found....it will start at 0, flip to 1 with the first 1 bit it finds, then flip back to 0 at the second (pair)
* The XOR is a flag set for every odd count it finds


Improvements ----
public static short parity(long x) {
    short result = 0;
    while (x != 0) {
        result ^= 1;  //flip the result on each iteration, flips to 1 on the first, remember XOR will flip if they are the same
        x &= (x-1);  //drops the lowest set bit of x;
    }
    return result;
}
* The brute force iterated through each LSB and checked
* This one is selecting each '1', skipping all the 0s, and then the XOR is flipping and keeping a count
