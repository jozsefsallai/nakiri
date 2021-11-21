export default {
  github: 'https://github.com/jozsefsallai/nakiri',
  docsRepositoryBase:
    'https://github.com/jozsefsallai/nakiri/blob/master/pages/docs',
  titleSuffix: ' - Nakiri',
  logo: (
    <>
      <span className="mr-2 font-extrabold hidden md:inline">NakiriAPI</span>
      <span className="text-gray-600 font-normal hidden md:inline">
        Developer Documentation
      </span>
    </>
  ),
  nextLinks: true,
  prevLinks: true,
  search: true,
  darkMode: true,
  footer: true,
  footerText: (
    <div class="flex text-xs flex-col">
      <div>Made with ❤️ and Nakirium by @jozsefsallai</div>
      <div>
        Nakiri is an open-source project &ndash;{' '}
        <a
          href="https://github.com/jozsefsallai/nakiri"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </div>
    </div>
  ),
  footerEditLink: 'Edit this page on GitHub',
  floatTOC: true,
};
