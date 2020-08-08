class GetImage {
    async request(url = '', data = {}) {
        const BASE_URL = 'https://source.unsplash.com';
        const response = await fetch(new URL(BASE_URL + url));
        return response.url;
    }

    async getRandom(data) {
        const { width, height } = data;
        const sizes = width && height ? `/${width}x${height}` : '';

        return this.request(`/random${sizes}`, {
            orientation: 'landscape'
        });
    }
}

export default GetImage;