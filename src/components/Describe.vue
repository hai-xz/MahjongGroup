<script lang="ts" setup>



</script>

<template>
    <div style="overflow: auto;background-color:white;height: 100%;width: 100%;padding: 1em;">
            <header>
        <h1>麻将胡牌与听牌算法文档</h1>
    </header>

    <section>
        <p>为了方便测试，这是在一个vite+vue3项目里写的代码，并在网页中展示了部分功能，核心的算法逻辑在 <code>core</code> 文件夹下面，你可以拷贝到自己熟悉的开发环境中去</p>
    </section>

    <section>
        <h2>1. 介绍</h2>
        <p>一个麻将胡牌与听牌算法，它能判断当前手牌能否进行胡牌以及能否进行听牌，支持魔法牌，大胡逻辑。</p>
        <p>同时，它还能具有出牌提示，并且能实现支持大胡逻辑的功能。</p>

        <div class="note">
            <p><strong>注意：</strong> 这个算法有大胡牌型的计算流程，但是本人并没有去过多的计算这些大胡牌型，只是以示例的目的实现了几个牌型。</p>
            <p>麻将子玩法多，你可以以继承的方式在子类中去实现。</p>
            <p>这个算法默认只有万条筒牌型，但是想要加入风牌与字牌等牌型要添加的逻辑也不难，下面会给出示例。</p>
        </div>

        <p>为了便于理解，可以先默认：</p>
        <ul>
            <li>数字 <code>1-9</code> 表示万牌</li>
            <li>数字 <code>17-25</code> 表示筒牌</li>
            <li>数字 <code>33-41</code> 表示条牌</li>
        </ul>
    </section>

    <section>
        <h2>2. 使用示例</h2>

        <article>
            <h3>1. 判断一组牌能否胡牌</h3>
            <pre><code>const can: boolean = new MahjongGroupBase([1, 1, 4, 5, 6], 0, []).init().solutionList.length > 0  //can = true</code></pre>
            <p>第二个参数 <code>0</code> 表示你当前有几张魔法牌，暂时给0。</p>
            <p>其中构造函数的第三个参数 <code>[]</code> 表示你当前吃碰杠的牌，比如
                <code>[[6,6,6],[7,8,9],[17,17,17,17]]</code>，这个数据主要是用来判断大胡牌型用的。</p>
        </article>

        <article>
            <h3>2. 魔法牌机制</h3>
            <p>假如你的玩法是有魔法牌机制的情况，比如 <code>1</code> 能进行变牌，那么得改一下调用方式：</p>
            <pre><code>const can: boolean = new MahjongGroupBase([4, 5, 6], 2, []).init().solutionList.length > 0  //can = true</code></pre>
            <p><code>1</code>不在作为手牌传递了，而是作为魔法牌传递。</p>
        </article>

        <article>
            <h3>3. 判断一组牌能听什么牌</h3>
            <p>假如你的手牌是 <code>2,2,6,7</code>，那么：</p>
            <pre><code>const data = new MahjongGroupBase([2, 2, 6, 7], 1, [])
data.init()
const m = data.getAllListenCard()       //[...m.keys()] 为 [5,8]    也就是听5,8</code></pre>
            <p><code>m</code>为一个map对象，键为能听的牌，值为对应的番数。</p>
            <p>传递的第二个参数 <code>1</code> 表示有一张魔法牌，如果这个时候能让所有牌进行组合，即能胡牌，而这张魔法牌所变的牌便是你所胡的牌。</p>
        </article>

        <article>
            <h3>4. 特殊的牌型组合</h3>
            <p>假如你的某个玩法中，<code>[9,1,1]</code>，能被算作是一个合法的牌型，那么你需要改一下 <code>getRelatedGroup</code> 方法的实现。</p>
            <p>子类的 <code>getRelatedGroup</code> 方法大概长这样：</p>
            <pre><code>protected getRelatedGroup(targetNumber: number, alreadyTakeGroupList: GroupNumberType[]) {
    const data = super.getRelatedGroup(targetNumber, alreadyTakeGroupList)
    if (targetNumber === 1 || targetNumber === 9) {
        data.push([1, 1, 9])
    }
    return data
}</code></pre>
        </article>

        <article>
            <h3>5. 特定将牌限制</h3>
            <p>如果你的玩法中只能用特定的 <code>2 5 8</code> 作为将牌的话，也就是对子只能是 <code>2 5 8</code>，那你只需要改一下 <code>takeSameNumber</code>
                方法。</p>
            <p>它大概是这样：</p>
            <pre><code>protected takeSameNumber(targetNumber: number, minCount: number, maxCount: number): GroupNumberType[] {
    if([2,5,8].includes(targetNumber %16)){
        minCount = 3
    }
    return super.takeSameNumber(targetNumber, minCount, maxCount)
}</code></pre>
        </article>

        <article>
            <h3>6. 特殊的胡牌牌型</h3>
            <p>可以参考 <code>checkSpecialCardGroup</code> 方法，默认实现了一个七对牌型的检测。</p>
        </article>

        <article>
            <h3>7. 麻将的名堂判断</h3>
            <p>可以参考 <code>mateMintan</code> 方法，内部实现了：</p>
            <ul>
                <li>清一色(全是同一种花色)</li>
                <li>碰碰胡(没有顺子)</li>
                <li>全球人(只剩1张手牌)</li>
            </ul>
            <p>的名堂判断。具体的名堂类型的表示是使用数字表示的，可以根据需要自行修改。</p>
        </article>

        <article>
            <h3>8. 番数的判断</h3>
            <p>可以修改 <code>getAllListenCard</code> 方法，默认计算方式是 <code>fan = mintanList.length**2</code>。</p>
        </article>

        <article>
            <h3>9. 扩展玩法(东南西北中发白)</h3>
            <p>假如你的玩法中有 <code>东南西北中发白</code> 这些牌，那你需要修改几个方法：</p>
            <ol>
                <li><code>getAllCard</code> 方法，这个方法是创建一个麻将玩法中所有的牌，你应该把东南西北中发白加进去</li>
                <li><code>getRelatedGroup</code> 方法，当targetNumber 为 东南西北中发白时，你需要让这个函数返回的正确的分组</li>
            </ol>
        </article>
    </section>

    <section>
        <h2>3. 出牌提示</h2>
        <p>实现一个出牌提示的功能其实简单。</p>
        <p>如果要实现的功能是 当玩家打出某张牌能进行听牌的话，就提示玩家打出这张牌能进行听牌。</p>

        <div class="example">
            <p><strong>示例：</strong> 手牌为 <code>list = [2,2,5,6,7,17,17,21]</code> 这个时候提示出 <code>21</code>。</p>
            <p>具体实现就是将一张手牌从 <code>list</code> 中移除，判断剩余的牌能否进行听牌操作。</p>
            <pre><code>const p1 = new MahjongGroupBase([2,5,6,7,17,17,21], 1, [])
const p2 = new MahjongGroupBase([2,2,6,7,17,17,21], 1, [])
const p3 = new MahjongGroupBase([2,2,5,7,17,17,21], 1, [])
const p4 = new MahjongGroupBase([2,2,5,6,17,17,21], 1, [])
const p5 = new MahjongGroupBase([2,2,5,6,7,17,21], 1, [])
const suitable = new MahjongGroupBase([2,2,5,6,7,17,17], 1, [])   //移除了21</code></pre>
            <p>只有 <code>suitable.getAllListenCard().size > 0</code> 所以这个时候只要提示出 <code>21</code> 即可，甚至还能在
                <code>suitable</code> 中拿到所听的牌与对应的番数。</p>
        </div>
    </section>

    <section>
        <h2>4. 进一步扩展出牌提示</h2>
        <p>在上面的出牌提示中，只有打出某张牌能进行听牌才会有提示，当然，对于玩家来讲这已经够用了，但我想能不能再进一步扩展实现一个简易的ai出牌。</p>

        <div class="note">
            <p>在打牌的过程中，我们的出牌的思路一般都是打出一张我们不那么需要的牌(暂时不考虑牌桌剩余牌数量的影响)，然后在下一次摸牌中期望得到一张自己想要的牌，从而让自己尽快的进行胡牌或者听牌。</p>
        </div>

        <p>所以我觉得可以借着这个思路，直接让一张牌变为鬼牌，然后打出另外一张牌，如果这个时候能进行听牌，那么我就认为出这张牌算是合适的。</p>
        <p>所以我写了 <code>GetOutCard</code> 类，并且通过多种方式共同影响计算权重的方式来得到一个最佳的出牌效果。</p>
        <p>我觉得只要权重设置的合适，那它能做到每一次出牌都十分的合理（现在的权重是我凭着感觉随便给的）。</p>

        <article>
            <h3>使用效果:</h3>
            <pre><code>const outCard = new GetOutCard([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 41], [], 0, 2).get()   // 9</code></pre>
            <p>把最后一个 <code>41</code> 改成 <code>9</code> 之后：</p>
            <pre><code>const outCard = new GetOutCard([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 9], [], 0, 2).get()   // 18 (实际上 18 22 39 权重都一样，只是优先返回最先得到的)</code></pre>
            <p>个人认为效果还不错。</p>
        </article>

        <article>
            <h3>一组模拟自动出牌的数据:</h3>
            <pre>(14)[2, 2, 4, 7, 8, 24, 25, 25, 33, 36, 36, 37, 40, 40] '出：' 4
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
胡牌 (14)[2, 2, 2, 23, 24, 25, 36, 36, 36, 37, 38, 39, 40, 41]</pre>
        </article>
    </section>
    </div>
</template>

<style scoped>
body {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
}

h1,
h2,
h3,
h4 {
    color: #2c3e50;
    margin-top: 24px;
    margin-bottom: 16px;
}

h1 {
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

h2 {
    border-left: 4px solid #3498db;
    padding-left: 10px;
}

h3 {
    border-bottom: 1px dashed #ddd;
    padding-bottom: 5px;
}

code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
    color: #c7254e;
}

pre {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 12px;
    overflow: auto;
    line-height: 1.45;
}

.note {
    background-color: #e7f4ff;
    border-left: 4px solid #3498db;
    padding: 12px;
    margin: 15px 0;
}

.example {
    background-color: #f0fff0;
    border-left: 4px solid #2ecc71;
    padding: 12px;
    margin: 15px 0;
}

.warning {
    background-color: #fff8e6;
    border-left: 4px solid #f39c12;
    padding: 12px;
    margin: 15px 0;
}

ul,
ol {
    padding-left: 20px;
}

li {
    margin-bottom: 8px;
}
</style>