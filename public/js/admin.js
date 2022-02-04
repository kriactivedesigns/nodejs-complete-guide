const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const prodEl = btn.closest('article');

    fetch(`/admin/delete-product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        console.log(result);
        prodEl.parentNode.removeChild(prodEl);
    })
    .catch(err => {
        console.log(err)
    })
}