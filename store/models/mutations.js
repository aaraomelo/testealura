export default {
  add (state, model) {
    state.models.push(model)
  },
  clear (state) {
    state.models = []
  }
}