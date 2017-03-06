/**
 * selection range api for component input and textarea.
 */
export default {
  methods: {
    setSelectionRange (selectionStart, selectionEnd) {
      this.$el.focus()
      this.$el.setSelectionRange(selectionStart, selectionEnd)
    },

    getSelectionRange (callback) {
      callback({
        selectionStart: this.$el.selectionStart,
        selectionEnd: this.$el.selectionEnd
      })
    }
  }
}
