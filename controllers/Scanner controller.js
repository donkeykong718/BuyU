const PROXY = 'https://cors-proxy-k7a5pa4az44r.runkit.sh'
const barcodeURL = `${PROXY}/api.barcodelookup.com/v3/products?`

export const barcodeSearch = async (request, response) => {
  try {
    const barcode = request.params.barcode;
    const results = await fetch(`${barcodeURL}barcode=${barcode}&formatted=y&key=${process.env.BARCODE_KEY}`)
    const barcodeResults = await results.json();
    console.log(barcodeResults);
    response.json(barcodeResults);
  }
  catch (error) {
    console.error(error);
    response.status(500).json("Error message");
  }
};


