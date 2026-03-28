import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="hall" role="presentation">
    <div class="hall-dust" aria-hidden="true"></div>
    <div class="salon">
      <div class="salon-frame">
        <div class="salon-frame-inner">
          <header class="salon-header">
            <p class="salon-eyebrow">— 非公式 · お助け —</p>
            <h1 class="salon-title">
              <span class="salon-title-main">お助けの館</span>
              <span class="salon-title-sub">Another Eden Helper</span>
            </h1>
            <div class="salon-ornament" aria-hidden="true">
              <span class="salon-ornament-line"></span>
              <span class="salon-ornament-gem">◆</span>
              <span class="salon-ornament-line"></span>
            </div>
            <p class="salon-tagline">
              時を渡る旅の手引きを、ここに少しずつ集めていく館です。
            </p>
          </header>

          <section class="salon-intro" aria-labelledby="intro-heading">
            <h2 id="intro-heading" class="salon-section-title">館主より</h2>
            <p class="salon-lead">
              攻略メモや装備・キャラの整理、計算の置き場などを想定しています。
              いまは扉と回廊だけ用意したばかりです。
            </p>
          </section>

          <section class="salon-grid" aria-label="今後のコンテンツ">
            <article class="hall-card">
              <div class="hall-card-frame">
                <h3 class="hall-card-title">書庫 · 攻略・ストーリー</h3>
                <p class="hall-card-desc">章やイベントの覚え書き（未実装）</p>
                <p class="hall-card-status">扉はまだ閉じています</p>
              </div>
            </article>
            <article class="hall-card">
              <div class="hall-card-frame">
                <h3 class="hall-card-title">陳列室 · キャラと装備</h3>
                <p class="hall-card-desc">一覧や検索の棚（未実装）</p>
                <p class="hall-card-status">扉はまだ閉じています</p>
              </div>
            </article>
            <article class="hall-card">
              <div class="hall-card-frame">
                <h3 class="hall-card-title">工房 · 計算と試算</h3>
                <p class="hall-card-desc">ダメージ試算など（未実装）</p>
                <p class="hall-card-status">扉はまだ閉じています</p>
              </div>
            </article>
          </section>

          <footer class="salon-footer">
            <div class="salon-ornament salon-ornament--small" aria-hidden="true">
              <span class="salon-ornament-line"></span>
              <span class="salon-ornament-gem">◇</span>
              <span class="salon-ornament-line"></span>
            </div>
            <p>
              本館はファンによる非公式のお助けページです。
              「アナザーエデン」は WFS, Inc. の商標です。
            </p>
          </footer>
        </div>
      </div>
    </div>
  </div>
`
