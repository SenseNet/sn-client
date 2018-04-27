const anm = `@keyframes rotation {
    from {
            -webkit-transform: rotate(0deg);
    }
    to {
            -webkit-transform: rotate(359deg);
    }
}`

const s = document.styleSheets[0] as any
s.insertRule(anm, s.cssRules.length)
