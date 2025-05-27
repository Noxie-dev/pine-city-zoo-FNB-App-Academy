module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/index.html',
        'http://localhost:8080/animals.html',
        'http://localhost:8080/elephant.html',
        'http://localhost:8080/giraffe.html',
        'http://localhost:8080/lion.html'
      ],
      startServerCommand: 'python3 -m http.server 8080',
      startServerReadyPattern: 'Serving HTTP',
      startServerReadyTimeout: 10000
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
