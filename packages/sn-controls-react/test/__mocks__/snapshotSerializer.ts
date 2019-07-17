import toJson from 'enzyme-to-json'

// Do not render the repository, because of the schema it grows big
export const json = (wrapper: any) =>
  toJson(wrapper, {
    mode: 'shallow',
    noKey: false,
    map: info => {
      if (!info.props) {
        return info
      }
      if (info.props.repository) {
        info.props.repository = '[repository]'
      }
      return info
    },
  })
