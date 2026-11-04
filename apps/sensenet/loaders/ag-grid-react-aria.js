// AG Grid 27 renders aria-description as a React prop, but React 16/17 do not
// recognize it. Set the same accessible description on the DOM node instead.
// Keep this workaround scoped to the pinned header component; remove it when
// upgrading to a React version that supports aria-description.
module.exports = function agGridReactAria(source) {
  const setter = 'setAriaDescription: function (description) { return setAriaDescription(description); }'
  const prop = ', "aria-description": ariaDescription'
  if (!source.includes(setter) || !source.includes(prop)) {
    throw new Error('AG Grid header changed: review the React 16 aria-description compatibility loader')
  }
  return source
    .replace(
      setter,
      `setAriaDescription: function (description) {
    if (!eGui.current) return;
    if (description) eGui.current.setAttribute('aria-description', description);
    else eGui.current.removeAttribute('aria-description');
  }`,
    )
    .replace(prop, '')
}

// Use the same compatibility code when exercising the real grid in Jest.
module.exports.process = (source) => ({ code: module.exports(source) })
