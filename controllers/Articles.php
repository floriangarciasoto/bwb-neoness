<?php

class Articles extends Controller
{
    // On ajoute la propriété correspondante au modèle en tant que protected afin qu'elle soit clairement définie
    // dans l'instance de cette classe lors de l'appel dans les méthodes avec $this, mais aussi dans le méthodes
    // parentes afin d'affecter la valeur de l'attribut depuis le parent Controller avec : $this->$model = new $model()
    protected Article $Article;

    public function __construct()
    {
        $this->loadModel('Article');
    }

    public function index(): void
	{
        $articles = $this->Article->getAll();

        $this->render('index',compact('articles'));
    }

    public function create(): void
	{
        $this->render('create');
    }

    public function save(): void
	{
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /articles');
            exit;
        }

        $title = trim($_POST['title']) ?? '';
        $content = trim($_POST['content']) ?? '';
        $slug = strtolower(preg_replace('/ +/','-',$title));
        
        if ($title === '' || $content === '') {
            $error = "Le titre et le contenu sont obligatoires";
            $this->render('create',compact('error','title','content'));
            return;
        }
        
        $data = [
            'slug' => $slug,
            'title' => $title,
            'content' => $content,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $this->Article->create($data);
        
        header('Location: /articles');
        exit;
    }

    public function delete(?int $id = null): void
	{
        if ($id === null) {
            $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        }

        if (!empty($id)) {
            $this->Article->delete($id);
        }

        header('Location: /articles');
        exit;
    }

    public function edit(?int $id = null): void
	{
        if ($id === null) {
            $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        }

        if (empty($id)) {
            http_response_code(404);
            $this->render('404');
            return;
        }

        $article = $this->Article->find($id);

        if (!$article) {
            http_response_code(404);
            $this->render('404');
            return;
        }

        $this->render('edit',compact('article'));
    }

    public function update(?int $id = null): void
	{
        if ($id === null) {
            $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        }

        if (empty($id) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /articles');
            exit;
        }

        $title = trim($_POST['title']) ?? '';
        $content = trim($_POST['content']) ?? '';
        $slug = strtolower(preg_replace('/ +/','-',$title));

        if ($title === '' || $content === '') {
            $error = "Le titre et le contenu sont obligatoires";
            $this->render('create',compact('error','title','content'));
            return;
        }

        $data = [
            'slug' => $slug,
            'title' => $title,
            'content' => $content
        ];

        $this->Article->update($id,$data);

        header('Location: /articles');
        exit;
    }

    public function read(?string $slug = null): void
    {
        if ($slug === null) {
            $slug = isset($_GET['slug']) ? (string) $_GET['slug'] : null;
        }

        if (empty($slug)) {
            header('Location: /articles');
            exit;
        }

        $article = $this->Article->findBySlug($slug);

        if (!$article) {
            header('Location: /articles');
            exit;
        }

        $this->render('read',compact('article'));
    }
}