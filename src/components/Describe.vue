<script lang="ts" setup>



</script>

<template>
    <div style="width: 100%;height: 100%;overflow: auto;background-color: aliceblue; padding: 1rem;">
        <h1>麻将胡牌与听牌算法说明</h1>

        <div class="note">
            <p>为了方便测试，这是在一个Vite + Vue3项目里写的代码，并在网页中展示了部分功能。核心的算法逻辑在<code>core</code>文件夹下面，你可以拷贝到自己熟悉的开发环境中去。</p>
        </div>

        <h2>1. 介绍</h2>
        <p>一个麻将胡牌与听牌算法，它能判断当前手牌能否进行胡牌以及能否进行听牌，支持魔法牌、大胡逻辑。同时，它还能具有出牌提示，并且能实现支持大胡逻辑的功能。</p>
        <p>这个算法有大胡牌型的计算流程，但是本人并没有过多地计算这些大胡牌型，只是以示例的目的实现了几个牌型。麻将子玩法多，你可以以继承的方式在子类中去实现。</p>
        <p>这个算法默认只有万条筒牌型，但是想要加入风牌与字牌等牌型要添加的逻辑也不难，下面会给出示例。</p>

        <h2>2. 使用示例</h2>

        <h3>2.1 判断一组牌能否胡牌</h3>
        <div class="example">
            <pre><code>const can: boolean = new MahjongGroupBase([1, 1, 4, 5, 6], 0, []).init().solutionList.length > 0;  // can = true</code></pre>
            <p>第二个参数<code>0</code>表示你当前有几张魔法牌，暂时给<code>0</code>。其中构造函数的第三个参数<code>[]</code>表示你当前吃碰杠的牌，比如<code>[[6,6,6],[7,8,9],[17,17,17,17]]</code>，这个数据主要是用来判断大胡牌型用的。
            </p>
        </div>

        <h3>2.2 魔法牌机制</h3>
        <div class="example">
            <pre><code>const can: boolean = new MahjongGroupBase([4, 5, 6], 2, []).init().solutionList.length > 0;  // can = true</code></pre>
            <p><code>1</code>不在作为手牌传递了，而是作为魔法牌传递。</p>
        </div>

        <h3>2.3 判断一组牌能听什么牌</h3>
        <div class="example">
            <pre><code>const data = new MahjongGroupBase([2, 2, 6, 7], 1, []);
data.init();
const m = data.getAllListenCard();       // [...m.keys()] 为 [5,8]    也就是听5,8</code></pre>
            <p><code>m</code>为一个<code>Map</code>对象，键为能听的牌，值为对应的番数。传递的第二个参数<code>1</code>表示有一张魔法牌，如果这个时候能让所有牌进行组合，即能胡牌，而这张魔法牌所变的牌便是你所胡的牌。
            </p>
        </div>

        <h3>2.4 特殊牌型组合</h3>
        <div class="example">
            <pre><code>protected getRelatedGroup(targetNumber: number, alreadyTakeGroupList: GroupNumberType[]) {
    const data = super.getRelatedGroup(targetNumber, alreadyTakeGroupList);
    if (targetNumber === 1 || targetNumber === 9) {
        data.push([1, 1, 9]);
    }
    return data;
}</code></pre>
            <p>如果你的麻将玩法有一些特殊的牌型组合，比如<code>[9,1,1]</code>能被算作是一个合法的牌型，那么你需要改一下<code>getRelatedGroup</code>方法的实现。</p>
        </div>

        <h3>2.5 特定将牌</h3>
        <div class="example">
            <pre><code>protected takeSameNumber(targetNumber: number, minCount: number, maxCount: number): GroupNumberType[] {
    if([2,5,8].includes(targetNumber %16)){
        minCount = 3;
    }
    return super.takeSameNumber(targetNumber, minCount, maxCount);
}</code></pre>
            <p>如果你的玩法中只能用特定的<code>2 5 8</code>作为将牌的话，也就是对子只能是<code>2 5 8</code>，那你只需要改一下<code>takeSameNumber</code>方法。
            </p>
        </div>

        <h3>2.6 特殊胡牌牌型</h3>
        <div class="example">
            <p>特殊的胡牌牌型可以参考<code>checkSpecialCardGroup</code>方法，默认实现了一个七对牌型的检测。</p>
        </div>

        <h3>2.7 名堂判断</h3>
        <div class="example">
            <p>麻将的名堂判断，可以参考<code>mateMintan</code>方法，内部实现了<code>清一色</code>（全是同一种花色）、<code>碰碰胡</code>（没有顺子）、<code>全球人</code>（只剩1张手牌）的名堂判断。具体的名堂类型的表示是使用数字表示的，可以根据需要自行修改。
            </p>
        </div>

        <h3>2.8 番数判断</h3>
        <div class="example">
            <p>番数的判断可以修改<code>getAllListenCard</code>方法，默认计算方式是<code>fan = mintanList.length**2</code>。</p>
        </div>

        <h3>2.9 风牌与字牌</h3>
        <div class="example">
            <p>假如你的玩法中有<code>东南西北中发白</code>这些牌，那你需要修改几个方法：</p>
            <ol>
                <li><code>getAllCard</code>方法，这个方法是创建一个麻将玩法中所有的牌，你应该把<code>东南西北中发白</code>加进去。</li>
                <li><code>getRelatedGroup</code>方法，当<code>targetNumber</code>为<code>东南西北中发白</code>时，你需要让这个函数返回正确的分组。
                </li>
            </ol>
        </div>

        <h2>3. 出牌提示</h2>
        <p>实现一个出牌提示的功能其实简单。如果要实现的功能是当玩家打出某张牌能进行听牌的话，就提示玩家打出这张牌能进行听牌。</p>
        <div class="example">
            <pre><code>const suitable = new MahjongGroupBase([2,2,5,6,7,17,17], 1, []);   // 移除了21
if (suitable.getAllListenCard().size > 0) {
    // 提示出21
}</code></pre>
            <p>只有<code>suitable.getAllListenCard().size > 0</code>，所以这个时候只要提示出<code>21</code>即可，甚至还能在<code>suitable</code>中拿到所听的牌与对应的番数。
            </p>
        </div>

        <h2>4. 进一步扩展出牌提示</h2>
        <p>在上面的出牌提示中，只有打出某张牌能进行听牌才会有提示。当然，对于玩家来讲这已经够用了，但我想能不能再进一步扩展实现一个简易的AI出牌。</p>
        <div class="example">
            <pre><code>const outCard = new GetOutCard([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 41], [], 0, 2).get();   // 9</code></pre>
            <p>把最后一个<code>41</code>改成<code>9</code>之后：</p>
            <pre><code>const outCard = new GetOutCard([1, 1, 3, 4, 4, 5, 6, 9, 18, 22, 25, 25, 39, 9], [], 0, 2).get();   // 18 (实际上 18 22 39 权重都一样，只是优先返回最先得到的)</code></pre>
            <p>个人认为效果还不错。</p>
        </div>

        <h3>4.1 模拟自动出牌</h3>
        <div class="example">
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
        </div>
    </div>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 20px;
}

h1,
h2,
h3 {
    color: #333;
}

code {
    background-color: #f4f4f4;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: monospace;
}

pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
}

.note {
    background-color: #e7f3fe;
    border-left: 6px solid #2196F3;
    padding: 10px;
    margin: 10px 0;
}

.example {
    background-color: #e7f3fe;
    border-left: 6px solid #4CAF50;
    padding: 10px;
    margin: 10px 0;
}
</style>