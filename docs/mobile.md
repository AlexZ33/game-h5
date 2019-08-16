# 移动适配方案
<b>页面的适配主要需解决以下问题: </b>
1、元素自适应问题
2、文字rem问题
3、高清图问题
4、1像素问题
5、横竖屏显示问题
6、手机字体缩放问题
7、防止手机设置非标准字体

- 添加 viewport meta 标签
> viewport meta 标签源于 Apple 公司，用来定义 iOS Safari 浏览器展示网页内容的可视范围及缩放比
率。它虽然没有成为W3C标准，但是被其他绝大多数的移动端浏览器所支持（目前已知 IE Mobile 10
不支持）。W3C 尝试将 viewport meta 标签的功能进行标准化并通过 CSS 的 @viewport 规则来实现
同样的功能，但这个标准目前还在草案中，兼容性也没有 viewport meta 标签
```
<meta name="viewport" content="width=device-width, initial-scale=1">
```
## 元素自适应问题

举个栗子：

在 1080px 的视觉稿中，左上角有个logo，宽度是 180px（高度问题同理可得）。

那么logo在不同的手机屏幕上等比例显示应该多大尺寸呢？

其实按照比例换算，我们大致可以得到如下的结果：

- 在CSS像素是 375px 的手机上，应该显示多大呢？结果是：375px * 180 / 1080 = 62.5px
- 在CSS像素是 360px 的手机上，应该显示多大呢？结果是：360px * 180 / 1080 = 60px
- 在CSS像素是 320px 的手机上，应该显示多大呢？结果是：320px * 180 / 1080 = 53.3333px
以下就是一些实现思路：
- `使用css的媒体查询 @media` 
- `使用 Viewport 单位及 rem`
```
@media only screen and (min-width: 375px) {
  .logo {
    width : 62.5px;
  }
}

@media only screen and (min-width: 360px) {
  .logo {
    width : 60px;
  }
}

@media only screen and (min-width: 320px) {
  .logo {
    width : 53.3333px;
  }
}

```
这个方案有2个比较突出的问题：

如果再多一种屏幕尺寸，就得多写一个 @media 查询块；
页面上所有的元素都得在不同的 @media 中定义一遍不同的尺寸，这个代价有点高。


- Media Queries本质是: 解决了「为不同特性的浏览器视窗使用不同的样式代码」

- 使用 Viewport 单位及 rem: ：让页面元素的尺寸能够依据浏览器视窗尺寸变化而平滑变
化。

<b>方法 1</b> <a>仅使用 vw 作为 CSS 长度单位</a>

1. 利用 Sass 函数将设计稿元素尺寸的像素单位转换为 vw 单位
```
// iPhone 6尺寸作为设计稿基准
$vw_base: 375;
@function vw($px) {
  @return ($px / $vm_base) * 100vw;
}
```
2. 无论是文本字号大小还是布局高宽、间距、留白等都使用 vw 作为 CSS 单位
   ```
   .mod_nav {
     background-color: #fff;
     &_list {
       display: flex;
       padding: vm(15) vm(10); //内边距
       &_item {
         flex: 1;
         text-align: center;
         font-size: vm(10); // 字体大小
         &_logo {
           display: block;
           margin: 0 auto;
           width: vm(40); // 宽度
           height: vm(40); // 高度
           img {
             display: block;
             margin: 0 auto;
             width: vm(40); //宽度
             height: vm(40); // 高度
             img {
               display: block;
               margin: 0 auto;
               max-width: 100%
             }
           }
         }
         &_name {
           margin-top: vm(2)
         }
       }
     }
   }
   ```
   
3.什么是 1像素问题 ？
> 我们说的1像素，就是指1 CSS像素。
比如设计师实际了一条线，但是在有些手机上看着明显很粗，为什么？
因为这个1px，在有些设备上（比如：[dpr]()=3），就是用了横竖都是3的物理像素矩阵（即：3x3=9 CSS像素）来显示这1px，导致在这些设备上，这条线看上去非常粗！
其实在在中手机上应该是1/3px显示这条线。

 1 物理像素线（也就是普通屏幕下 1px，高清屏幕下 0.5px 的情况）采用transform 属性 scale实现
 - 方案A：使用css3的 scaleY(0.5) 来解决

  实例1
   ```
    .mod_grid {
      position: relative;
      &::after {
        // 实现1物理像素的下边框
        content: '',
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #ddd;
        height: 1px;
        left: 0;
        right: 0;
        top: 0;
        @media only screen and (-webkit-min-device-pixel-ratio:2) {
          -webkit-transform: scaleY(0.5);
          -webkit-transform-origin: 50% 0%  
        }
      }
    }
   ```
   实例2： div的border-top的1px问题解决
   ```
    .div:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: auto;
  right: auto;
  height: 1px;
  width: 100%;
  background-color: #c8c7cc;
  display: block;
  z-index: 15;
  -webkit-transform-origin: 50% 0%;
          transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .div:before {
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .div:before {
    -webkit-transform: scaleY(0.33);
            transform: scaleY(0.33);
  }
}
   ```

   但是，这种方案只能解决直线的问题，涉及到圆角之类的，就无能为力！

   - 方案B： 页面缩放解决问题

 我们先来讲讲页面缩放能解决1px问题的原理：
 首先大家需要了解一些 viewport 的常识，参考：[这里](https://www.cnblogs.com/2050/p/3877280.html)
 假如以下手机的 `dpr=2`


1. 对于需要保持高宽比的图，应改用 paddingtop实现
   ```
   .mod_banner {
     position: relative;
     // 使用padding-top 实现宽高比为 100:750 的图片区域
     padding-top: percentage(100/750);
     height: 0;
     overflow: hidden; 
     img {
       width: 100%;
       height: auto;
       position: absolute;
       left: 0;
       top: 0;
     }
   }
   ```
   由此，我们不需要增加其他任何额外的脚本代码就能够轻易实现一个常见布局的响应式页面，效果如下：

   ![](https://user-images.githubusercontent.com/21971405/63002297-2e2d1380-bea8-11e9-97c6-77c63429225e.png)

2. ：桌面版 Chrome 支持的字体大小默认不能小于 12PX，可通过 「chrome://settings/
显示高级设置－网络内容－自定义字体－最小字号（滑到最小）」设置后再到模拟器里体验
DEMO。

<b>方法 2 </b> vw搭配 rem，寻找最优解

方法 1 实现的响应式页面虽然看起来适配得很好，但是你会发现由于它是利用 Viewport 单位实现的布
局，依赖于视窗大小而自动缩放，无论视窗过大还是过小，它也随着视窗过大或者过小，失去了最大
最小宽度的限制，有时候不一定是我们所期待的展示效果。试想一下一个 750px 宽的设计稿在 1920px
的大屏显示器上的糟糕样子。
当然，你可以不在乎移动端页面在 PC 上的展现效果，但如果有低成本却有效的办法来修复这样的小
瑕疵，是真切可以为部分用户提升体验的。
我们可以结合 rem 单位来实现页面的布局。rem 弹性布局的核心在于根据视窗大小变化动态改变根元
素的字体大小，那么我们可以通过以下步骤来进行优化：

1. 给根元素的字体大小设置随着视窗变化而变化的 vw 单位，这样就可以实现动态改变其大小
2. 其他元素的文本字号大小、布局高宽、间距、留白都使用 rem 单位
3. 限制根元素字体大小的最大最小值，配合 body 加上最大宽度和最小宽度，实现布局宽度的最大
最小限制

```
// rem 单位换算: 定为75px只是方便运算, 750px-75px、640-64px、1080px-108px，如此类推
```

## 参考文献和方案
[如何在Vue项目中使用vw实现移动端适配(转)](https://www.jianshu.com/p/1f1b23f8348f)
[移动端H5解惑-概念术语（一）](https://github.com/sunmaobin/sunmaobin.github.io/issues/27)
[移动端H5解惑-页面适配](https://juejin.im/post/5b6503dee51d45191e0d30d2) -> [内容备份](https://github.com/sunmaobin/sunmaobin.github.io/issues/28)
