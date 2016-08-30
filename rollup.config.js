import babel from 'rollup-plugin-babel'

export default {
  plugins: [
    babel({
      presets: [ ['es2015', { modules: false, loose: true }] ],
      plugins: ['external-helpers-2']
    })
  ]
}
