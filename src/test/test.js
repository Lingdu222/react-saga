/**
 * 新建数组的三种方法
 */

// 方法一
var a = new Array(1,2,3)
console.log(a)

// 方法二
var b = [1,2,3]
console.log(b)

// 方法三：es6中新增的将一组值转换为数组的方法，该方法的出现是为了弥补构造函数Array（）因为参数不同导致的不同行为
var c = Array.of(1,2,3)
console.log(c)

// 构造函数Array（）因为参数不同导致的不同行为，只有在参数个数不少于2时候，才会返回新的数组。
Array()         //[]
Array(3)        //[ , , ]
Array(1,2,3)    //[1,2,3]



/**
 * 数组的检测
   对于一个网页或者一个全局作用域而言，使用instanceof操作符检测，通过返回的boolean值可以得出是否为数组，
   但是这样检测的问题在如果网页中包含两个以上不同的全局作用域，就会从在两个以上不同版本的Array构造函数，如果从一个框架向另一个框架传入一个数组，
   那么传入的数组与第二个框架中原声创建的数组分别有不同的构造函数。
   在ES5中引入的Array.isArray()解决了这个问题，但如果在不支持ES5的浏览器中检测数组，则需要些兼容性方法，所以检测数组的方法如下：
 */
function checkArray(arr) {
    if(typeof Array.isArray){
        return Array.isArray(arr);
    }else{
        return Object.prototype.toString.call(arr)==='[object Array]';
    }
}




/**
 * 数组中的方法
 */

//1.添加项
//push()接收任意数量的参数，逐个将其添加至数组末尾，返回修改后的数组的长度
//unshift()在数组的前端添加任意个项并返回新数组的长度

//2.删除项
//pop()从数组末尾移除最后一项，返回移除的项
//shift()移除数组中的第一项并返回该项

//3.排序
//reverse()反转数组项的顺序
var values = [1,2,3,4,5];
values.reverse();
console.log(values); // =>5,4,3,2,1

//sort()按照升序排列数组项，但是它在实现排序时会调用每个数组项的toString()放法，去比较字符串，所以会出现如下情况
var values = [0,1,5,10,15];
values.sort();
console.log(values); // => 0,1,10,15,5
/*
为了在使用sort()方法时返回正确的排序，我们需要给sort()传入一个比较函数，该比较函数传入两个参数，
如果第一个参数应该位于第二个参数之前则返回一个负数，如果两个参数相等返回0，如果第一个参数应该位于第二个参数之后则返回一个正数。
*/
/*升序降序则更改返回值即可*/
function compare(value1,value2){
    if(value1 < value2){
        return -1;
    }else if(value1 > value2){
        return 1;
    }else {
        return 0;
    }
}
var values = [0,1,5,10,15];
values.sort(compare);
console.log(values);


/**
 * 这个方法有问题，咱是还没有用过
 * copyWithin()在当前数组内部将指定位置的成员复制到其他位置，会覆盖原来的成员。修改原来的数组形成新的数组,
 * 参数：
   target(必需)：从该位置开始替换数据
   start (可选)：从该位置开始读取数据，默认为0。如果为负值，表示倒数
   end (可选)：到该位置前停止读取数据，默认等于数组长度。如果为负值表示倒数
 */

var Q = [1,2,3];
var Q1 = Q.copyWithin(0);    
var Q2 = Q.copyWithin(0,1); 
var Q3 = Q.copyWithin(0,1,2);
console.log(Q1)
console.log(Q2)
console.log(Q3)



/**
 * 生成新数组
 */
//截取
// 1.slice()接受一个或两个参数，要返回的起始位置到结束位置但不包括结束位置项，如果只写一个参数则截取数组到最后。可以接收负数作为参数（注意两个数全部是位置）

var colors4=["red","green","blue"]
var removed4=colors4.slice(0,1)
var removed5=colors4.slice(-2)//参数可以是负数，如果第二个函数没有默认到最后（和splice的区别二）
var removed6=colors4.slice(-2,-1)//当参数是负数的时候，必须全部是负数，否侧不起作用
console.log(colors4)//不改变原来的数组（和splice的区别一）
console.log(removed4)
console.log(removed5)
console.log(removed6)


// 2.splice()做多可以接收三个参数，分别为起始位置，要删除的项目数(注意是项数)，要插入的任意数量的项，同个这三个参数是否传入可以实现删除，插入，替换
//参数不可以是负数，改变原来的数组

//删除
var colors=["red","green","blue"]
var removed=colors.splice(0,1)
var removed2=colors.splice(0,1,"zhang")
console.log(colors)
console.log(removed2)

//删除并插入
var colors2=["red","green","blue"]
var removed2=colors2.splice(0,1,"zhang")
console.log(colors2)
console.log(removed2)

var colors3=["red","green","blue"]
var removed3=colors3.splice(1,0,"zhang")
console.log(colors3)
console.log(removed3)

//concat():链接，
var a = [1,2,3];
var b = a.concat('a','b',['c','d','e']);
console.log(a)
console.log(b);

/**
 * 寻找
indexOf() ,lastIndexOf(),includes()
indexOf()与lastIndexOf()用于查找数组中是否有该元素的方法，如果有返回该元素的位置，如果没有就返回-1，但是这个方法有两个缺点：
1.不够语义化；2.它内部使用严格等于运算符===，导致了对NaN的误判，所以ES7新增includes()去克服这些缺点
includes()方法是ES7新增的，用于查找数组是否包含某一个元素，返回布尔值，接受两个参数，要查找的元素和查找的开始位置
*/
var S=["zhang","yu","hong"]
console.log(S.includes("zhang"))
console.log(S.includes("jiang"))




//find()和findIndex():参数：一个回掉函数   回调的参数：当前值、当前位置、原数组
var C=[1,3,-5,9,20]
var C1=C.find((n)=>n<0)
var C2=C.findIndex((value,index,arr)=>value<0)
console.log(C1)
console.log(C2)



/**
 * 归并方法
 */
// 1.reduce()该方法传递两个参数，第一个参数是函数，第二参数是初始值（可选），这个方法可用于求和，积，最大值
var F=[1,2,3,4,5]
// 求和
var sum=F.reduce((x,y)=>x+y,0)
console.log(sum)

// 求积
var product=F.reduce((x,y)=>x*y,1)
console.log(product)

// 求最大值
var max=F.reduce((x,y)=>(x>y)?x:y)
console.log(max)



//2.join(),将数组中的每一项转化为字符串并链接起来，返回最终生成的字符串，
//注意：可以传参数，指定生成字符串中分割数组的各个元素，如果不指定，默认用逗号隔开
var H=["zhang","yu","hong"]
console.log(H.join())
console.log(H.join(""))


//3.fill()，参数：填充项，填充的开始位置，填充的结束位置
var J=new Array(3)
console.log(J)
console.log(J.fill(5))




/**
 * 迭代方法
    ES5为数组定义了五个迭代方法
    每个方法都接收两个参数：要在每一项上运行的函数和（可选的）运行该函数的作用域对象----影响this的值。
    传入这些方法中的函数会接收三个参数：数组项的值、该项在数组中的位置和数组对象本身。
    every():对数组中的每一项运行给定的函数，如果该函数对每一项都返回true,则返回true
    some():对数组中每一项运行给定的函数，如果该函数对任一项返回true，则返回true
    filter():对数组中每一项运行给定的函数，返回该函数会返回true的项组成的数组
    forEach():对数组中的每一项运行给定的函数。没有返回值
    map():对数组中的每一项运行给定的函数，返回每次调用的结果组成的数组
 */