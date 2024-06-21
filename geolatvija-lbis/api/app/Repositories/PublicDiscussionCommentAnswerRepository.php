<?php


namespace App\Repositories;

use App\Models\PublicDiscussionCommentAnswer;
use Illuminate\Database\Eloquent\Model;

class PublicDiscussionCommentAnswerRepository extends BaseRepository
{

    public function __construct(PublicDiscussionCommentAnswer $publicDiscussionCommentAnswer)
    {
        parent::__construct($publicDiscussionCommentAnswer);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new PublicDiscussionCommentAnswer();
    }

    public function findUnique($comment, $decision, $status)
    {
        return PublicDiscussionCommentAnswer::where('comment_id', $comment)
        ->where('decision', $decision)
        ->where('status', $status)
        ->first();
    }

    public function makeRead($commentId)
    {
        $count = PublicDiscussionCommentAnswer::where('comment_id', $commentId)
            ->where('has_seen', false)
            ->count();

        PublicDiscussionCommentAnswer::where('comment_id', $commentId)
            ->where('has_seen', false)
            ->update(['has_seen' => true]);

        return $count;
    }

    public function getDiscussions($ids)
    {
        return PublicDiscussionCommentAnswer::whereIn('comment_id', $ids)
            ->where('has_seen', false)
            ->get();
    }

}
