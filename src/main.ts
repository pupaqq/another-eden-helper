import './style.css'

/** 旧 anaden-yakata.jp（Cocoon）のカテゴリ一覧に近いラベル（表示のみ） */
const categories = [
  'アにゃザーエデン',
  'アイテム',
  'アナザーダンジョン',
  'キャラクター',
  'キーアイテム',
  'グラスタ',
  'サブクエスト',
  'マップ',
  'メインストーリー',
  '協奏',
  '外典',
  '武器',
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="yakata-root public-page">
    <div class="header-container" id="header-container">
      <div class="header-container-in wrap">
        <header class="header" id="header">
          <div class="header-in wrap">
            <h1 class="logo logo-header logo-image">
              <a href="#" class="site-name site-name-text-link">
                <span class="site-name-text">
                  <img
                    class="site-logo-image header-site-logo-image"
                    src="/logo-yakata.png"
                    alt="アナデンの館"
                    height="100"
                  />
                </span>
              </a>
            </h1>
          </div>
        </header>
        <nav class="navi" id="navi" aria-label="グローバルナビ（未実装）">
          <div class="navi-in wrap"></div>
        </nav>
      </div>
    </div>

    <div class="content" id="content">
      <div class="content-in wrap sidebar-left">
        <aside class="sidebar" id="sidebar" role="complementary">
          <div class="widget widget-search">
            <form class="search-box input-box" role="search">
              <input type="search" class="search-edit" placeholder="サイト内を検索" name="s" disabled aria-label="検索キーワード" />
              <button type="button" class="search-submit" disabled aria-label="検索"><span class="fas fa-search" aria-hidden="true"></span></button>
            </form>
          </div>
          <div class="widget widget-categories">
            <h3 class="widget-sidebar-title widget-title">カテゴリー</h3>
            <ul class="widget-list">
              ${categories
                .map(
                  (c) =>
                    `<li><a class="cat-link" href="#">${c}</a></li>`,
                )
                .join('')}
            </ul>
          </div>
          <div class="widget widget-recent">
            <h3 class="widget-sidebar-title widget-title">最近の投稿</h3>
            <p class="widget-muted">（準備中）</p>
          </div>
        </aside>

        <main class="main" id="main">
          <article class="article page-body">
            <div class="entry-content">
              <table class="top-icons-table" aria-label="トップアイコン">
                <tbody>
                  <tr>
                    <td><span class="icon-placeholder" aria-hidden="true"></span></td>
                    <td><span class="icon-placeholder" aria-hidden="true"></span></td>
                    <td><span class="icon-placeholder" aria-hidden="true"></span></td>
                    <td><span class="icon-placeholder" aria-hidden="true"></span></td>
                  </tr>
                </tbody>
              </table>

              <p class="banner-wrap">
                <span class="site-banner" role="img" aria-label="バナー（プレースホルダー）"></span>
              </p>

              <div class="column-wrap column-2">
                <div class="column-left">
                  <div class="yakata-box">
                    <h2>最近のアップデート</h2>
                    <h3>出逢い</h3>
                    <p class="box-note">キャラクターアイコン・リンクは未接続のプレースホルダです。</p>
                    <h3>サイドストーリー</h3>
                    <p class="box-note">旧サイト同様、ここに最新情報やバナーが並ぶ想定です。</p>
                    <h3>顕現</h3>
                    <p class="box-note">顕現バナー・一覧の置き場。</p>
                    <h3>その他</h3>
                    <ul class="disc-list">
                      <li>キャンペーンやイベント情報のメモ欄</li>
                    </ul>
                  </div>
                </div>
                <div class="column-right">
                  <div class="yakata-box">
                    <h2 class="box-title-center">最近の攻略</h2>
                    <h3>メイン・外典など</h3>
                    <ul class="strategy-list">
                      <li>（未実装）</li>
                      <li>（未実装）</li>
                      <li>（未実装）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>

    <footer class="footer footer-container" id="footer">
      <div class="footer-in wrap">
        <div class="footer-bottom">
          <div class="footer-bottom-logo">
            <a href="#" class="footer-logo-link">
              <img src="/logo-yakata.png" alt="" width="200" height="62" class="footer-logo-img" />
            </a>
          </div>
          <div class="footer-bottom-content">
            <p class="footer-note">
              本ページはファンによる非公式サイトです。旧「アナデンの館」（anaden-yakata.jp）の構成・配色を
              Internet Archive の公開スナップショットを参考に再現したデモです。
              「アナザーエデン」は WFS, Inc. の商標です。
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
`
