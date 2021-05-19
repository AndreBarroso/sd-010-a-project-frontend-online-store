import React from 'react';
import PropTypes from 'prop-types';
import Button from './button';
import ShopCartButton from './ShopCartButton';

class ProductDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      item: '',
      textArea: '',
      select: 1,
    };
    this.fetchProduct = this.fetchProduct.bind(this);
  }

  componentDidMount() {
    this.fetchProduct();
  }

  handleChange(field, valueUpdate) {
    this.setState({ [field]: valueUpdate });
  }

  handleSubmit() {
    const { textArea, select } = this.state;
    const productEvaluation = `Texto:${textArea}, Nota:${select}`;
    const previousEvaluations = JSON.parse(localStorage.getItem('productSubmit'));
    const evaluationUpdate = !previousEvaluations ? [] : previousEvaluations;
    localStorage
      .setItem('productSubmit', JSON.stringify([...evaluationUpdate, productEvaluation]));
  }
  
  async getProductsById(id) {
    const url = `https://api.mercadolibre.com/items?ids=${id}`;
    const data = await fetch(url);
    const item = await data.json();
    return item[0].body;
  }

  async fetchProduct() {
    const { match: { params: { id } } } = this.props;
    const productData = await this.getProductsById(id);
    return this.setState({
      item: productData,
    });
  }

  render() {
    const { item } = this.state;
    const newObj = {
      id: item.id,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
      qtd: 1,
    };
    return (
      <div data-testid="product-detail-name">
        {item.title}
        <form>
          <select
            onChange={ (event) => this.handleChange('select', event.target.value) }
          >
            <option value={ 1 }>1</option>
            <option value={ 2 }>2</option>
            <option value={ 3 }>3</option>
            <option value={ 4 }>4</option>
            <option value={ 5 }>5</option>
          </select>
          <label htmlFor="product-detail-evaluation">
            <textarea
              data-testid="product-detail-evaluation"
              onChange={ (event) => this.handleChange('textArea', event.target.value) }
            />
          </label>
          <input onClick={ () => this.handleSubmit() } type="submit" value="Enviar" />
        </form>
        <Button obj={ newObj } dataTestId="product-detail-add-to-cart" />
        <ShopCartButton />
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ProductDetails;
