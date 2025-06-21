<article>
    <section>
        <h1>麻将胡牌与听牌算法介绍</h1>
        <p><strong>说明：</strong>为了方便测试，这是在一个vite+vue3项目里写的代码，并在网页中展示了部分功能。核心的算法逻辑在 core 文件夹下面，你可以拷贝到自己熟悉的开发环境中去。</p>
        <ul>
            <li>默认只有万条筒牌型，但可以很方便地加入风牌与字牌等。</li>
            <li>支持魔法牌、大胡逻辑，以及智能出牌提示和AI功能。</li>
            <li>麻将子玩法多，可以通过继承方式扩展实现特定规则。</li>
        </ul>
        <p>为了便于理解，默认：<br>
            数字1-9 表示万牌<br>
            数字17-25 表示筒牌<br>
            数字33-41 表示条牌
        </p>
    </section>
    <section>
        <h2>使用示例</h2>
        <ol>
            <li>
                <p><strong>判断一组牌能否胡牌：</strong></p>
                <pre><code class="language-js">const can: boolean = new MahjongGroupBase([1, 1, 4, 5, 6], 0, []).init().solutionList.length > 0  //can = true</code></pre>
                <p>第二个参数 0 表示当前有几张魔法牌；第三个参数表示当前吃碰杠的牌。</p>
            </li>
            <li>
                <p><strong>带有魔法牌机制的情况：</strong></p>
                <pre><code class="language-js">const can: boolean = new MahjongGroupBase([4, 5, 6], 2, []).init().solutionList.length > 0  //can = true</code></pre>
                <p>1 不作为手牌传递，而是作为魔法牌传递。</p>
            </li>
            <li>
                <p><strong>判断一组牌能听什么牌：</strong></p>
                <pre><code class="language-js">const data = new MahjongGroupBase([2, 2, 6, 7], 1, [])
data.init()
const m = data.getAllListenCard()       //[...m.keys()] 为 [5,8]    也就是听5,8</code></pre>
                <p>m 是一个map对象，键为能听的牌，值为对应的番数。</p>
            </li>
            <li>
                <p><strong>特殊的牌型组合：</strong></p>
                <pre><code class="language-js">protected getRelatedGroup(targetNumber: number, alreadyTakeGroupList: GroupNumberType[]) {
    const data = super.getRelatedGroup(targetNumber, alreadyTakeGroupList)
    if (targetNumber === 1 || targetNumber === 9) {
        data.push([1, 1, 9])
    }
    return data
}</code></pre>
            </li>
            <li>
                <p><strong>特定的将牌（对子）：</strong></p>
                <pre><code class="language-js">protected takeSameNumber(targetNumber: number, minCount: number, maxCount: number): GroupNumberType[] {
    if ([2, 5, 8].includes(targetNumber % 16)) {
        minCount = 3
    }
    return super.takeSameNumber(targetNumber, minCount, maxCount)
}</code></pre>
            </li>
            <li>
                <p><strong>特殊的胡牌牌型：</strong></p>
                <p>参考 <code>checkSpecialCardGroup</code> 方法，默认实现了一个七对牌型的检测。</p>
            </li>
            <li>
                <p><strong>名堂判断：</strong></p>
                <p>参考 <code>mateMintan</code> 方法，内部实现了 清一色、碰碰胡、全球人 的名堂判断。具体的名堂类型的表示是使用数字表示的，可以根据需要自行修改。</p>
            </li>
            <li>
                <p><strong>番数的判断：</strong></p>
                <p>可以修改 <code>getAllListenCard</code> 方法，默认计算方式是 <code>fan = mintanList.length ** 2</code>。</p>
            </li>
            <li>
                <p><strong>加入东南西北中发白：</strong></p>
                <p>需要修改几个方法：
                    <ol>
                        <li><code>getAllCard</code> 方法，添加东南西北中发白。</li>
                        <li><code>getRelatedGroup</code> 方法，当 <code>targetNumber</code> 为东南西北中发白时，返回正确的分组。</li>
                    </ol>
                </p>
            </li>
        </ol>
    </section>
    <section>
        <h2>出牌提示</h2>
        <p>实现一个出牌提示的功能其实简单...</p>
        <pre><code class="language-js">// 示例代码
const suitable = new MahjongGroupBase([2,2,5,6,7,17,17], 1, [])   //移除了21
if (suitable.getAllListenCard().size > 0) {
    console.log('提示出 21');
}</code></pre>
    </section>
    <section>
        <h2>进一步扩展出牌提示</h2>
        <p>在上面的出牌提示中，只有打出某张牌能进行听牌才会有提示...</p>
        <pre><code class="language-js">// 使用 GetOutCard 类
const outCard = new GetOutCard([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 41], [], 0, 2).get()   // 9</code></pre>
        <p>模拟自动出牌的数据如下：</p>
        <pre><code>(14)[2, 2, 4, 7, 8, 24, 25, 25, 33, 36, 36, 37, 40, 40] '出：' 4
(13)[2, 2, 7, 8, 24, 25, 25, 33, 36, 36, 37, 40, 40] '抓牌：' 39
(14)[2, 2, 7, 8, 24, 25, 25, 33, 36, 36, 37, 39, 40, 40] '出：' 7
(13)[2, 2, 8, 24, 25, 25, 33, 36, 36, 37, 39, 40, 40] '抓牌：' 23
(14)[2, 2, 8, 23, 24, 25, 25, 33, 36, 36, 37, 39, 40, 40] '出：' 33
(13)[2, 2, 8, 23, 24, 25, 25, 36, 36, 37, 39, 40, 40] '抓牌：' 41
(14)[2, 2, 8, 23, 24, 25, 25, 36, 36, 37, 39, 40, 40, 41] '出：' 8
(13)[2, 2, 23, 24, 25, 25, 36, 36, 37, 39, 40, 40, 41] '抓牌：' 19
(14)[2, 2, 19, 23, 24, 25, 25, 36, 36, 37, 39, 40, 40, 41] '出：' 19
(13)[2, 2, 23, 24, 25, 25, 36, 36, 37, 39, 40, 40, 41] '抓牌：' 36
(14)[2, 2, 23, 24, 25, 25, 36, 36, 36, 37, 39, 40, 40, 41] '出：' 25
(13)[2, 2, 23, 24, 25, 36, 36, 36, 37, 39, 40, 40, 41] '抓牌：' 2
(14)[2, 2, 2, 23, 24, 25, 36, 36, 36, 37, 39, 40, 40, 41] '出：' 40
(13)[2, 2, 2, 23, 24, 25, 36, 36, 36, 37, 39, 40, 41] '抓牌：' 38
共抓牌次数: 7
胡牌 (14)[2, 2, 2, 23, 24, 25, 36, 36, 36, 37, 38, 39, 40, 41]</code></pre>
    </section>
</article>
